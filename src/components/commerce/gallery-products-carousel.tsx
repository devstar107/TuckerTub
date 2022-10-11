import Image from 'next/image'
import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { Product } from '~/types'
import { GalleryImage } from './image-gallery'

interface ProductCardProps {
  product: Product
}

export const GalleryProductsCarousel = ({ product }: ProductCardProps) => {

  return (
    <div className="relative grid h-auto grid-cols-1 rounded-lg" style={{width: 'calc((100% - 2.5rem) / 3)'}}>
      <div>
        <GalleryImage productData={product} categoryHandle={product.categories[0].slug!} />
      </div>
    </div>
  )
}
