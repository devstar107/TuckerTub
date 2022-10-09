import Image from 'next/image'
import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { Product } from '~/types'

import { ProductImage } from './product-image'

interface ProductCardProps {
  product: Product
}

export const ProductCardSimple = ({ product }: ProductCardProps) => {
  return (
    <div className="h-full w-full rounded-lg bg-colorFourteen">
      <Image
        src={product.images?.[0]?.src ?? '/assets/images/product-image-placeholder.svg'}
        className="w-full rounded-lg"
        alt="Meat"
        width="440px"
        height="440px"
        sizes="(max-width: 440px) 100vw, 440px"
      />
      <div className="flex items-center justify-between p-4 text-lg font-bold text-colorFourteen">
        <div>{product.name}</div>
        <ArrowRight />
      </div>
    </div>
  )
}
