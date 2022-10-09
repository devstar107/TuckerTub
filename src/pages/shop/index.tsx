/* eslint-disable no-use-before-define */
import type { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'
import NextLink from 'next/link'

import { ProductCard } from '~/components/commerce/product-card'
import { GridItems, Layout } from '~/components/common'
import { MegaMenuItem } from '~/components/common/layout/navbar/MegaMenu'
import {
  CategorySelect,
  ClearFilters,
  SortSelect,
  ProteinSelect,
  WeightSelect,
  TypeSelect
} from '~/components/shop'
import { megaMenuItems } from '~/constants/mega-menu'
import { wooCommerceAPI } from '~/lib/WooCommerce'
import type { Category } from '~/types/WooCommerce'
import { PageContainer, Wrapper } from '~/ui'

export default function Shop({ categories }: InferGetStaticPropsType<typeof getStaticProps>) {
  // console.log('shop categories', categories)

  return (
    <>
      <NextSeo
        title="Shop | Tucker Tub"
        description="Shop Description"
        openGraph={{
          title: 'Shop | Tucker Tub',
          description: 'Shop Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />

      <Layout>
        <div className="bg-colorFifteen pt-10">
          <Wrapper>
            <div className="grid grid-cols-1 gap-8 text-colorFourteen sm:grid-cols-[2fr_4fr]">
              <div>
                <h1 className="p-0 font-tucker-tub text-header uppercase">Shop dog food</h1>
              </div>
              <div>
                <h4 className="p-0">All natural dog food made farm fresh in Australia.</h4>
                <p className="py-4">
                  We're changing the way dogs eat, one bite at a time. Our selection of dog food and
                  treats are made 100% natural with nutrient-rich ingredients from local farms in
                  Australia. No additives, fillers or preservatives. Just real, honest food for your
                  favourite companion. Tucker Tub is made with love, backed by expertise.
                </p>
              </div>
            </div>
          </Wrapper>
          <div className="m-auto grid h-full w-[80%] grid-cols-2 place-items-center gap-12 pt-10 pb-12 text-center sm:grid-cols-4">
            {megaMenuItems.map(item => {
              return (
                <NextLink key={item.id} href={`/shop/${item.slug}`}>
                  <MegaMenuItem key={item.id} megaMenuData={item} />
                </NextLink>
              )
            })}
          </div>
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
          {/* TODO: We need another one like GridItems here in order to press View All, but the markup here is a little much in order to be fully reusable and it also includes a title, so we need another component here to deal with this one. */}
          <section className="mx-auto px-8">
            {categories && categories.length > 0 && (
              <div>
                {categories?.map(category => {
                  return (
                    <div key={category.id}>
                      <h2 className="m-auto w-[calc(80%_+_4rem)] text-title font-bold text-colorFourteen">
                        {category.name}
                      </h2>
                      <GridItems
                        data={category.products}
                        slicedData={category.products.slice(0, 3)}
                        cardComponent={ProductCard}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const { data: categoriesData } = await wooCommerceAPI.get('products/categories')

  // gets products based on categories and if they are published, and then adds the products to each category

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

  const categoriesResult = await Promise.all(categories)

  // console.log('categoriesResult', categoriesResult)

  const reorderedCategories = [
    categoriesResult.find(category => {
      return category.slug.toLowerCase() === 'cooked-food'
    }),
    categoriesResult.find(category => {
      return category.slug.toLowerCase() === 'raw-food'
    }),
    categoriesResult.find(category => {
      return category.slug.toLowerCase() === 'dry-food'
    }),
    categoriesResult.find(category => {
      return category.slug.toLowerCase() === 'treats'
    })
  ]

  // console.log('reorderedCategories', categoriesResult)

  return {
    props: {
      categories: reorderedCategories
    }
  }
}
