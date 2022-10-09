import Image from 'next/image'
import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { Product } from '~/types'

import { ProductImage } from './product-image'

interface ProductCardProps {
  product: Product
}

export const SuggestedProductsCarousel = ({ product }: ProductCardProps) => {
  // console.log('prodim', product)

  return (
    <div className="relative mr-8 grid h-auto w-[300px] grid-cols-1 rounded-lg lg:w-[323px]">
      <div>
        <ProductImage productData={product} categoryHandle={product.categories[0].slug!} />
      </div>
      <NextLink
        href={`/shop/${product.categories[0].slug!}/${product.slug}`}
        className="flex h-full w-auto justify-between p-5"
      >
        <div className="flex h-fit w-full justify-between font-bold text-colorFourteen">
          <p className="w-[80%] flex-wrap sm:text-base lg:text-lg">{product.name}</p>
          <ArrowRight fill="rgb(203, 153, 114)" />
        </div>
      </NextLink>
    </div>
  )
}
