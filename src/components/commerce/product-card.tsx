import NextLink from 'next/link'

import { ArrowRight } from '~/components/common/icons'
import type { Product } from '~/types'

// import { ProductCategoryTags } from './product-category-tags'
import { ProductImage } from './product-image'

interface ProductCardProps {
  data: Product
  categoryHandle: string
}

export const ProductCard = (props: ProductCardProps) => {
  const { data, categoryHandle } = props
  // console.log('ProductCard props', props)
  return (
    <div>
      {/* <ProductCategoryTags productData={productData} /> */}
      <div className="relative grid grid-cols-1 gap-x-4">
        <ProductImage productData={data} categoryHandle={categoryHandle} />
        <NextLink
          href={`/shop/${categoryHandle}/${data.slug}`}
          className="flex h-full w-full justify-between rounded-b-lg  p-4 font-bold text-colorFourteen"
        >
          <h4 className="w-[50%] text-lg text-colorFourteen">{data.name}</h4>
          <button type="button" className="justify-self-end">
            <ArrowRight fill="rgb(203, 153, 114)" />
          </button>
        </NextLink>
      </div>
    </div>
  )
}

ProductCard.displayName = 'ProductCard'