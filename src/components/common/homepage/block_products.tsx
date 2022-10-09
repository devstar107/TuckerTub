import type { ProductProps } from '~/types'
import { ButtonWithArrow, Text, Title, Wrapper } from '~/ui'
import { CursiveBasic } from '~/ui/cursive-basic'

import { EmblaCarouselProducts } from '../carousel/slider-products'

export const BlockProducts = ({ products }: ProductProps) => {
  const preferredProductsSlugs = [
    'tucker-tub-chicken-rice-stew',
    'tucker-tub-beef-casserole',
    'tucker-tub-savoury-chicken-loaf',
    'tucker-tub-raw-turkey-vegetable',
    'tucker-tub-raw-beef-vegetable',
    'tucker-tub-raw-chicken-vegetable',
    'tucker-tub-raw-veal-bones',
    'tucker-tub-raw-kangaroo-tails',
    'tucker-tub-beef-jerky'
  ]

  const clientPreferredProducts = products.filter(product => {
    return preferredProductsSlugs.includes(product.slug)
  })

  return (
    <div className="mt-[-135px] h-full w-full bg-colorFourteen pt-44 pb-10">
      <Wrapper>
        <div className="grid grid-cols-1 gap-x-8 text-left sm:grid-cols-[2fr_1fr]">
          <Title className="col-span-full text-colorFifteen">Tucker Tub</Title>
          <div>
            <CursiveBasic>All natural dog food, made farm fresh</CursiveBasic>
            <Text className="text-colorFifteen">
              Tucker Tub offers a selection of raw and cooked dog food, hand crafted with fresh
              local ingredients in country Victoria - delivered right to your door. Free from
              preservatives, additives, and fillers, each recipe is approved by vets and pet
              nutritionists. You can trust that your pup is getting the nutrients they need without
              any fluff.
            </Text>
          </div>
          <div className="py-10">
            <ButtonWithArrow center href="/shop" className="w-[310px] lg:w-[240px]">
              Shop All Products
            </ButtonWithArrow>
          </div>
        </div>
      </Wrapper>
      <div className="h-full w-full py-8">
        {clientPreferredProducts && clientPreferredProducts.length > 0 ? (
          <EmblaCarouselProducts sliderData={clientPreferredProducts} />
        ) : (
          <div className="text-center">
            <Title className="pt-6 text-colorFourteen">No products found</Title>
          </div>
        )}
      </div>
    </div>
  )
}
