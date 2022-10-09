import { EmblaSuggestedProducts } from '~/components/common/carousel/slider-products-suggested'
import type { Product } from '~/types'

interface RecommendedProductsProps {
  recommendedProducts: Product[]
}

export const RecommendedProducts = ({ recommendedProducts }: RecommendedProductsProps) => {
  return (
    <section>
      <h2 className="mx-auto w-full px-8 text-colorFourteen sm:w-[90%] sm:px-0 md:w-[80%] lg:w-[80%]">
        Your dog might also like...
      </h2>
      <section>
        <EmblaSuggestedProducts sliderData={recommendedProducts} />
      </section>
    </section>
  )
}
