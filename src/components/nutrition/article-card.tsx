/* eslint-disable camelcase */
import Image from 'next/image'
import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { WP_REST_API_Post } from '~/types/WordPress'

interface ArticleCardProps {
  data: WP_REST_API_Post
}

export const ArticleCard = ({ data }: ArticleCardProps) => {
  // console.log('Each article data', data)
  return (
    <NextLink
      className="relative m-auto grid w-full max-w-[350px] grid-cols-1 rounded-lg lg:max-w-[440px]"
      href={`/nutrition/${data?.slug}`}
    >
      <div className="relative h-[280px] lg:h-[340px]">
        <Image
          src={data?.featuredMedia || '/assets/images/product-image-placeholder.svg'}
          className="rounded-t-lg"
          layout="fill"
          objectFit="cover"
          alt="Meat"
          priority
        />
      </div>
      <div className="flex h-full w-full justify-between rounded-b-lg  bg-colorFourteen p-4  font-bold text-colorSix">
        <p className="sm:text-base lg:text-lg">{data?.title?.rendered}</p>
        <ArrowRight />
      </div>
    </NextLink>
  )
}
