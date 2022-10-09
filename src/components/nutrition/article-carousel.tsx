/* eslint-disable camelcase */
import Image from 'next/image'
import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { WP_REST_API_Post } from '~/types/WordPress'
import { ImageWrapper } from '~/ui'

interface ArticleCardProps {
  data: WP_REST_API_Post
}
export const ArticleCardCarousel = ({ data }: ArticleCardProps) => {
  console.log('data', data)
  return (
    <NextLink
      className="relative mr-8 grid h-full w-[300px] grid-cols-1 rounded-lg shadow-ecPrimary-4 lg:w-[440px]"
      href={`/nutrition/${data?.slug}`}
    >
      <div className="relative h-[230px] lg:h-[370px]">
        <Image
          src={data?.featuredMedia || '/assets/images/product-image-placeholder.svg'}
          className="rounded-t-lg"
          layout="fill"
          objectFit="cover"
          alt="Meat"
          priority
        />
      </div>

      <div className="flex h-full w-full items-center justify-between rounded-b-lg bg-colorFourteen p-5 font-bold text-colorFifteen">
        <p className="w-[80%] flex-wrap sm:text-base lg:text-lg">{data?.title?.rendered}</p>
        <ArrowRight fill="rgb(203, 153, 114)" />
      </div>
    </NextLink>
  )
}
