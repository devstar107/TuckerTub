/* eslint-disable no-use-before-define */
import type { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { Breadcrumbs, Layout } from '~/components/common'
import { BlockTips } from '~/components/common/homepage/block_tips'
import { NutritionArticle } from '~/components/nutrition/single-article'

export default function NutritionSinglePage({
  article,
  recommendedArticles
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log('article', article)
  console.log('recommendedArticles', recommendedArticles)
  return (
    <>
      <NextSeo
        title={article.yoast_head_json.title}
        description={article.yoast_head_json.og_description}
        openGraph={{
          title: article.yoast_head_json.og_title,
          description: article.yoast_head_json.og_description,
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: article.yoast_head_json.og_type,
          locale: article.yoast_head_json.og_locale,
          site_name: article.yoast_head_json.og_site_name,
          article: {
            publishedTime: article.yoast_head_json.article_published_time,
            modifiedTime: article.yoast_head_json.article_modified_time,
            tags: article.tags
          }
        }}
        noindex={article.yoast_head_json.robots.index}
        nofollow={article.yoast_head_json.robots.follow}
        robotsProps={{
          maxSnippet: article.yoast_head_json.robots['max-snippet'],
          maxImagePreview: article.yoast_head_json.robots['max-image-preview'],
          maxVideoPreview: article.yoast_head_json.robots['max-video-preview']
        }}
      />
      <Layout>
        <div className="mx-auto px-8">
          <Breadcrumbs isAbsolute />
        </div>
        <NutritionArticle article={article} />
        <BlockTips articles={recommendedArticles} />
      </Layout>
    </>
  )
}

export async function getStaticProps(props: any) {
  const { params } = props
  const { postHandle } = params

  const endpoint = process.env.WORDPRESS_ENDPOINT

  // single post

  const response = await fetch(`${endpoint}/wp-json/wp/v2/posts?slug=${postHandle}&_embed`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()

  // throw new Error('Not implemented')

  // recommended posts
  const recommendedResponse = await fetch(
    `${endpoint}/wp-json/wp/v2/posts?categories=${process.env.WORDPRESS_CATEGORY_NUTRITION}&_embed&status=publish&exclude=${data[0].id}`
  )
  const recommendedData = await recommendedResponse.json()

  // WP Images

  const featuredMediaSinglePost = data.map(post => {
    return post.featured_media
  })
  const featuredMediaResponseSinglePost = await Promise.all(
    featuredMediaSinglePost.map(async id => {
      const response = await fetch(`${endpoint}/wp-json/wp/v2/media/${id}`)
      return response.json()
    })
  )

  const filterMediaWithImageSinglePost = featuredMediaResponseSinglePost.filter(media => {
    return data
      .map(post => {
        return post.featured_media
      })
      .includes(media.id)
  })

  const singlePostCombinedData = data.map(post => {
    return {
      ...post,
      featuredMedia:
        filterMediaWithImageSinglePost.find(media => {
          return media.id === post.featured_media
        })?.source_url ?? ''
    }
  })

  const featuredMediaRecommendedPosts = recommendedData.map(post => {
    return post.featured_media
  })

  const featuredMediaResponseRecommendedPosts = await Promise.all(
    featuredMediaRecommendedPosts.map(async id => {
      const response = await fetch(`${endpoint}/wp-json/wp/v2/media/${id}`)
      return response.json()
    })
  )

  // console.log('featuredMediaResponse', featuredMediaResponseRecommendedPosts)

  const filterMediaWithImageRecommendedPosts = featuredMediaResponseRecommendedPosts.filter(
    media => {
      return recommendedData
        .map(post => {
          return post.featured_media
        })
        .includes(media.id)
    }
  )

  console.log('filterMediaWithImageRecommendedPosts', filterMediaWithImageRecommendedPosts)

  const recommendedArticlesCombinedData = recommendedData.map(post => {
    return {
      ...post,
      featuredMedia:
        filterMediaWithImageRecommendedPosts.find(media => {
          return media.id === post.featured_media
        })?.source_url ?? ''
    }
  })

  return {
    props: {
      article: singlePostCombinedData[0],
      recommendedArticles: recommendedArticlesCombinedData
    },
    revalidate: 60 * 60 * 1000 // 1 hour
  }
}

export async function getStaticPaths() {
  const endpoint = process.env.WORDPRESS_ENDPOINT

  const response = await fetch(
    `${endpoint}/wp-json/wp/v2/posts?categories=${process.env.WORDPRESS_CATEGORY_NUTRITION}&status=publish`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  const data = await response.json()

  const postData = data.map(item => {
    const { slug } = item
    return {
      params: {
        postHandle: slug
      }
    }
  })

  return {
    paths: postData,
    fallback: false
  }
}
