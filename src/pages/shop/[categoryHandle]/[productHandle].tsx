/* eslint-disable react/no-danger */
/* eslint-disable no-use-before-define */
import type { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { ProductImage } from '~/components/commerce/product-image'
import { RecommendedProducts } from '~/components/commerce/recommended-products'
import { VariantCard } from '~/components/commerce/variant-card'
import { Breadcrumbs, Layout } from '~/components/common'
import { wooCommerceAPI } from '~/lib/WooCommerce'
import type { Category, Product } from '~/types'
import { Wrapper } from '~/ui'

export default function Product({
  product,
  productVariants,
  recommendedProducts,
  categoryHandle
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // console.log('productVariants', productVariants)
  console.log('PRODUCT', product)
  return (
    <>
      <NextSeo
        title={`${product.name} | Tucker Tub`}
        description={product.description}
        openGraph={{
          title: `${product.name} | Tucker Tub`,
          description: product.description,
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <div className="bg-colorFifteen ">
          <div className="mx-auto px-8">
            <Breadcrumbs />
          </div>
          <div className="mx-auto w-full px-8 sm:w-[90%] sm:px-0 md:w-[80%] lg:w-[80%]">
            <div className="grid grid-cols-1 gap-8 text-colorFourteen sm:gap-16 md:gap-24 lg:grid-cols-2 lg:gap-[149px] ">
              {/* Image section */}
              <ProductImage productData={product} isSinglePage />
              {/* Product Section */}
              <VariantCard
                key={product.id}
                productData={product}
                productVariants={productVariants}
              />
            </div>
            <div className="grid grid-cols-1 gap-8 py-5 text-colorFourteen sm:gap-10 md:gap-24 lg:grid-cols-2 lg:gap-[149px]">
              <div>
                <h3>Description</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                  className="prose prose-lg text-colorEight prose-p:text-[19px]"
                />
              </div>
              <div>
                <div>
                  <h3>Ingredients</h3>
                  <p className="text-colorEight">{product.ingredients}</p>
                </div>
                {/* TODO: add reviews later */}
                {/* <div>
                  <h3>Reviews</h3>
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab deserunt eveniet
                    blanditiis vero neque dolorum at quod provident repellat maiores.
                  </p>
                </div> */}
              </div>
            </div>
          </div>
          <div className="h-full w-full py-8">
            {/* Recommended products */}
            {/* TODO: add slideshow - consider the right library */}
            {recommendedProducts.length > 0 && (
              <RecommendedProducts
                recommendedProducts={recommendedProducts}
                categoryHandle={categoryHandle}
              />
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps(props: any) {
  const { params } = props
  const { productHandle, categoryHandle } = params

  const { data: productData } = await wooCommerceAPI.get(
    `products?slug=${productHandle}&status=publish`
  )

  const { data: productVariantsData } = await wooCommerceAPI.get(
    `products/${productData[0].id}/variations?status=publish`
  )

  const recommendedProductsData = await wooCommerceAPI.get(
    `products?category=${productData[0].categories[0].id}&status=publish&per_page=100`
  )

  // recommendedProducts randomizes products that don't contain the same slug as the first product - productData[0]

  const recommendedProducts = recommendedProductsData.data
    .filter((product: Product) => {
      return product.slug !== productHandle
    })
    .sort(() => {
      return Math.random() - 0.5
    })
    .slice(0, 4)

  // GraphQL Request to get ingredients

  const productIngredients = await fetch(`${process.env.WORDPRESS_ENDPOINT}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
      query productByHandle {
        product(id: "${productHandle}", idType: SLUG) {
          productIngredients {
            fieldGroupName
            ingredients
          }
        }
      }
      `
    })
  })

  const productIngredientsResult = await productIngredients.json()
  const productIngredientsData = productIngredientsResult.data.product.productIngredients

  const productCombinedData = {
    ...productData[0],
    ingredients: productIngredientsData.ingredients
  }

  return {
    props: {
      product: productCombinedData as Product,
      productVariants: productVariantsData,
      recommendedProducts: recommendedProducts as Product[],
      categoryHandle
    },
    revalidate: 60 * 60 * 1000 // 1 hour
  }
}

export async function getStaticPaths() {
  // We get all the categories, and then we normalize the data by looping over the categories as well as the products in each category. We then return an object containing the category slug as well as the products in that category.

  // then we return the paths, and since the params need to contain both productHandle and categoryHandle as strings, we loop over the categoriesWithProducts as a flatMap and return the paths for each product which includes the categorySlug as well.

  const { data: categoriesData } = await wooCommerceAPI.get(`products/categories`)

  const categoriesWithoutUncategorized = categoriesData.filter((category: Category) => {
    return category.name.toLowerCase() !== 'uncategorised'
  })

  const categoriesWithProductsPromise = categoriesWithoutUncategorized.map(
    async (category: Category) => {
      const { id } = category
      const { data: productsData } = await wooCommerceAPI.get(
        `products?category=${id}&status=publish&per_page=100`
      )

      return {
        categoryHandle: category.slug,
        products: productsData
      }
    }
  )

  const categoriesWithProducts = await Promise.all(categoriesWithProductsPromise)

  const paths = categoriesWithProducts.flatMap(category => {
    return category.products.map((product: Product) => {
      return {
        params: {
          productHandle: product.slug,
          categoryHandle: category.categoryHandle
        }
      }
    })
  })

  return {
    paths,
    fallback: false
  }
}
