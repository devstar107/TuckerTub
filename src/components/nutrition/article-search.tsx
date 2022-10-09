/* eslint-disable camelcase */
import Image from 'next/image'
import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { WP_REST_API_Post } from '~/types/WordPress'
import { ImageWrapper } from '~/ui'

interface ArticleCardProps {
  data: WP_REST_API_Post
}

export const ArticleSearch = ({ data }: ArticleCardProps) => {
  // console.log('Each article data', data)
  return (
    <NextLink className="relative grid grid-cols-1 gap-x-4 " href={`/nutrition/${data?.slug}`}>
      <ImageWrapper className="shadow-ecPrimary-4">
        <Image
          src={data?.featuredMedia || '/assets/images/product-image-placeholder.svg'}
          className="rounded-lg"
          layout="fill"
          objectFit="cover"
          alt="Meat"
          priority
        />
      </ImageWrapper>
      <div className="flex h-full w-full justify-between rounded-b-lg  p-4 font-bold text-colorFourteen">
        <p className="text-md">{data?.title?.rendered}</p>
        <ArrowRight fill="rgb(203, 153, 114)" />
      </div>
    </NextLink>
  )
}
