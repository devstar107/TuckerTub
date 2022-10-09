/* eslint-disable no-use-before-define */
import type { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { ProductCard } from '~/components/commerce/product-card'
import { Breadcrumbs, Layout } from '~/components/common'
import {
  CategorySelect,
  ClearFilters,
  ProteinSelect,
  SortSelect,
  TypeSelect,
  WeightSelect
} from '~/components/shop'
import { wooCommerceAPI } from '~/lib/WooCommerce'
import type { Category } from '~/types/WooCommerce'
import { Wrapper } from '~/ui'

export default function Category({ category }: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('category category', category)
  return (
    <>
      <NextSeo
        title={`Shop | ${category.name} | Tucker Tub`}
        description="Shop Category Description"
        openGraph={{
          title: `Shop | ${category.name} | Tucker Tub`,
          description: 'Shop Category Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <div className="bg-colorFifteen">
          <div className="mx-auto px-8">
            <Breadcrumbs />
          </div>
          <Wrapper>
            <div className="grid grid-cols-1 gap-8 pt-4 pb-10 text-colorFourteen sm:grid-cols-[2fr_4fr]">
              <div>
                <h1 className="p-0 font-tucker-tub text-header uppercase">{category.name}</h1>
              </div>
              <div className="w-full">
                <p className="p-0">{category.description}</p>
              </div>
            </div>
          </Wrapper>
          {/* TODO: Hide sort for now */}
          {/* <div className="inline-grid grid-cols-2 items-start gap-x-8 px-8 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            <SortSelect />
            <CategorySelect />
            <ProteinSelect />
            <WeightSelect />
            <TypeSelect />
            <ClearFilters />
          </div> */}
          {/*  */}
          {/* Product Section */}
          <section className="mx-auto px-8">
            <div key={category.id}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {category.products.map(product => {
                  return (
                    <ProductCard key={product.id} data={product} categoryHandle={category.slug} />
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps(props: any) {
  const { params } = props
  const { categoryHandle } = params

  const { data: categoriesData } = await wooCommerceAPI.get(
    `products/categories?slug=${categoryHandle}`
  )

  const categoriesWithoutUncategorized = categoriesData.filter((category: Category) => {
    return category.name.toLowerCase() !== 'uncategorised'
  })

  const categories = categoriesWithoutUncategorized.map(async (category: Category) => {
    const { id } = category
    const { data: productsData } = await wooCommerceAPI.get(
      `products?category=${id}&status=publish&per_page=100`
    )

    return {
      ...category,
      products: productsData
    }
  })

  const categoriesPromise = Promise.all(categories)

  const categoryData = await categoriesPromise

  return {
    props: {
      category: categoryData[0]
    },
    revalidate: 60 * 60 * 1000 // 1 hour
  }
}

export async function getStaticPaths() {
  const { data: categoriesData } = await wooCommerceAPI.get('products/categories')

  const categoriesWithoutUncategorized = categoriesData.filter((category: Category) => {
    return category.name.toLowerCase() !== 'uncategorised'
  })

  const categories = categoriesWithoutUncategorized.map((category: Category) => {
    return {
      params: {
        categoryHandle: category.slug
      }
    }
  })

  return {
    paths: categories,
    fallback: false
  }
}
