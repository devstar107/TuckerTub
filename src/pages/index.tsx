import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'

import { Layout } from '~/components/common'
import { homepageSliderData } from '~/components/common/carousel/data/home-slider-data'
import { wooCommerceAPI } from '~/lib/WooCommerce'
import type { ArticleProps, Product } from '~/types'

interface HomeProps {
  products: Product[]
  articles: ArticleProps
}

const EmblaCarousel = dynamic( 
  async () => {
    const component = await import('~/components/common/carousel')
    return component.EmblaCarousel
},
{ ssr: false }
)

const DynamicBlockPersonalised = dynamic(
  async () => {
    const component = await import('~/components/common/homepage/block_lottiedog')
    return component.BlockPersonalised
  },
  { ssr: false }
)

const DynamicBlockProducts = dynamic(
  async () => {
    const component = await import('~/components/common/homepage/block_products')
    return component.BlockProducts
  },
  { ssr: false }
)

const DynamicBlockTips = dynamic(async () => {
  const component = await import('~/components/common/homepage/block_tips')
  return component.BlockTips
})

const DynamicBlockDifference = dynamic(async () => {
  const component = await import('~/components/common/homepage/block_difference')
  return component.BlockDifference
})

export default function Home({ products, articles }: HomeProps) {
  return (
    <>
      <NextSeo
        title="Home | Tucker Tub"
        description="Home Description"
        openGraph={{
          title: 'Home | Tucker Tub',
          description: 'Home Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <EmblaCarousel sliderData={homepageSliderData} />
        <DynamicBlockProducts products={products} />
        <DynamicBlockPersonalised />
        <DynamicBlockDifference />
        <DynamicBlockTips articles={articles} />
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const endpoint = process.env.WORDPRESS_ENDPOINT

  const { data } = await wooCommerceAPI.get('products?status=publish&per_page=100')

  const response = await fetch(
    `${endpoint}/wp-json/wp/v2/posts?categories=${process.env.WORDPRESS_CATEGORY_NUTRITION}&status=publish`
  )
  const articlesData = await response.json()

  const featuredMedia = articlesData.map(post => {
    return post.featured_media
  })

  const featuredMediaResponse = await Promise.all(
    featuredMedia.map(async id => {
      const response = await fetch(`${endpoint}/wp-json/wp/v2/media/${id}`)
      return response.json()
    })
  )

  const filtermediaWithImage = featuredMediaResponse.filter(media => {
    return articlesData
      .map(post => {
        return post.featured_media
      })
      .includes(media.id)
  })

  const combinedData = articlesData.map(post => {
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
      products: data,
      articles: combinedData
    }
  }
}
