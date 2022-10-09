/* eslint-disable no-use-before-define */
import { useMemo } from 'react'

import Fuse from 'fuse.js'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import { ProductCard } from '~/components/commerce/product-card'
import { Layout } from '~/components/common/layout'
import { ArticleCard } from '~/components/nutrition/article-card'

export default function Results(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { articles, products } = props
  const router = useRouter()
  const routerQuery = router.query.q

  const combinedItems = useMemo(() => {
    return [...articles, ...products]
  }, [articles, products])

  const fuse = useMemo(() => {
    return new Fuse(combinedItems, {
      keys: ['title.rendered', 'name'],
      includeScore: true,
      includeMatches: true,
      isCaseSensitive: false,
      threshold: 0.3
    })
  }, [combinedItems])

  if (routerQuery?.length === 0) {
    return null
  }

  if (combinedItems.length === 0) {
    return (
      <div className="text-center">
        <p>No results found for query "{routerQuery}"</p>
      </div>
    )
  }

  const searchResults = fuse.search(routerQuery)

  // This ternary operator is extremely useful. By default, fuse will not display anything. But if we have not put in any string, then we will just get the ordinary data. Otherwise, if we have searched for something, we display the fuse results.
  const finalResult = routerQuery
    ? searchResults.map(result => {
        return result.item
      })
    : []

  const articleData = finalResult.filter(item => {
    return item.type === 'post'
  })

  const productData = finalResult.filter(item => {
    return item.type !== 'post'
  })

  console.log('FinalResult', finalResult)

  return (
    <>
      <NextSeo title="Result | Tucker Tub" />
      <Layout>
        <div className="min-h-inherit bg-colorFifteen">
          <div className="p-8">
            <h1 className="pl-[10%] text-title text-colorFourteen">
              Search results for ‘{routerQuery}’
            </h1>
            {articleData.length > 0 ? (
              <>
                <h2 className="text-colorFourteen">Articles ({articleData.length})</h2>
                <section className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 md:grid-cols-3">
                  {articleData.map(article => {
                    return <ArticleCard key={article.id} data={article} />
                  })}
                </section>
              </>
            ) : null}
            {productData.length > 0 ? (
              <>
                <h2 className="text-colorFourteen">Products ({productData.length})</h2>
                <section className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 md:grid-cols-3">
                  {productData.map(product => {
                    return (
                      <ProductCard
                        key={product.id}
                        data={product}
                        categoryHandle={product.categories?.[0]?.slug}
                      />
                    )
                  })}
                </section>
              </>
            ) : null}
          </div>
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const searchQuery = context.query.q

  if (!searchQuery) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/products`)
  const productData = await productsResponse.json()

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/wp/v2/posts?categories=${process.env.NEXT_PUBLIC_WORDPRESS_CATEGORY_NUTRITION}&per_page=100&status=publish`
  )
  const data = await response.json()

  const featuredMedia = data.map(post => {
    return post.featured_media
  })

  const featuredMediaResponse = await Promise.all(
    featuredMedia.map(async id => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/wp/v2/media/${id}`
      )
      return response.json()
    })
  )

  const filtermediaWithImage = featuredMediaResponse.filter(media => {
    return data
      .map(post => {
        return post.featured_media
      })
      .includes(media.id)
  })

  const combinedData = data.map(post => {
    return {
      ...post,
      featuredMedia:
        filtermediaWithImage.find(media => {
          return media.id === post.featured_media
        })?.source_url ?? ''
    }
  })
  return {
    props: {
      articles: combinedData,
      products: productData
    }
  }
}
