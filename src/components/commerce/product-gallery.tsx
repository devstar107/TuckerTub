import { EmblaGalleryProducts } from '~/components/common/carousel/slider-products-gallery'
import type { Product } from '~/types'

interface GalleryProductsProps {
  GalleryProducts: Product[]
}

export const GalleryProducts = ({ GalleryProducts }: GalleryProductsProps) => {
  return (
    <section>
        <EmblaGalleryProducts sliderData={GalleryProducts} />
    </section>
  )
}
