import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { NutritionContent } from '~/components/nutrition'

export default function Nutrition({ articles }: any) {
  console.log('articles', articles)
  return (
    <>
      <NextSeo
        title="Nutrition | Tucker Tub"
        description="Tucker Tub's Nutrition"
        openGraph={{
          title: 'Nutrition | Tucker Tub',
          description: "Tucker Tub's Nutrition",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <NutritionContent articles={articles} />
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const endpoint = process.env.WORDPRESS_ENDPOINT

  const response = await fetch(
    `${endpoint}/wp-json/wp/v2/posts?categories=${process.env.WORDPRESS_CATEGORY_NUTRITION}&status=publish&per_page=100`
  )
  const data = await response.json()

  console.log('Posts by nutrition - index', data.length)

  const featuredMedia = data.map(post => {
    return post.featured_media
  })

  const featuredMediaResponse = await Promise.all(
    featuredMedia.map(async id => {
      const response = await fetch(`${endpoint}/wp-json/wp/v2/media/${id}`)
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
      articles: combinedData
    }
  }
}
