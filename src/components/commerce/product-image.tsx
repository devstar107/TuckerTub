import NextImage from 'next/future/image'
import NextLink from 'next/link'

import { ImageWrapper } from '~/ui'

interface ProductImageProps {
  productData: any
  isSinglePage?: boolean
  categoryHandle: string
}

interface RenderSpecialProductConditionProps {
  onSale: boolean
  isNew: boolean
}

function RenderSpecialProductCondition({
  onSale = false,
  isNew = false
}: RenderSpecialProductConditionProps) {
  if (onSale && isNew) {
    return (
      <div>
        <div className="absolute top-7 -left-4 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-colorTen px-2 py-1 font-tucker-tub text-xl font-bold text-colorFifteen">
          <span className="absolute top-[31%]">New</span>
        </div>
        <div className="absolute top-16 -left-4 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-colorThirteen px-2 py-1 font-tucker-tub text-xl font-bold text-colorFifteen">
          <span className="absolute top-[31%]">Sale</span>
        </div>
      </div>
    )
  }

  if (onSale) {
    return (
      <div className="absolute top-7 -left-4 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-colorThirteen px-2 py-1 font-tucker-tub text-xl font-bold text-colorFifteen">
        <span className="absolute top-[31%]">Sale</span>
      </div>
    )
  }

  if (isNew) {
    return (
      <div className="absolute top-10 -left-4 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-colorTen px-2 py-1 font-tucker-tub text-xl font-bold text-colorFifteen">
        <span className="absolute top-[31%]">New</span>
      </div>
    )
  }

  return null
}

export const ProductImage = (props: ProductImageProps) => {
  const { productData, isSinglePage, categoryHandle } = props
  // console.log('ProductImage props', props)
  const PRODUCT_NEW_TIMER = 30 * 24 * 60 * 60 * 1000 // 30 days

  const dateCreated = new Date(productData.date_created)
  const isProductNew = new Date().getTime() - dateCreated.getTime() < PRODUCT_NEW_TIMER

  const imageWrapperComponent = (
    <ImageWrapper className="group">
      {!productData.purchasable ? (
        <span className="absolute left-4 top-4 z-10 rounded-[50px] border border-white bg-black py-2 px-3 text-white">
          SOLD OUT
        </span>
      ) : null}
      <RenderSpecialProductCondition onSale={productData.on_sale} isNew={isProductNew} />
      <NextImage
        className={`h-full w-full rounded-[10px] bg-white object-contain ${
          productData.images.length > 1 &&
          'visible absolute opacity-100 transition-all duration-700 group-hover:invisible group-hover:opacity-0'
        }`}
        src={productData.images?.[0]?.src ?? '/assets/images/product-image-placeholder.svg'}
        sizes="(min-width: 75em) 33vw,
        (min-width: 48em) 50vw,
        100vw"
        width={615}
        height={615}
        alt={productData.name}
        priority
      />
      {productData.images.length > 1 && (
        <NextImage
          className="invisible absolute h-full w-full rounded-[10px] object-cover opacity-0 transition-all duration-700 group-hover:visible group-hover:opacity-100"
          src={productData.images[1].src}
          sizes="(min-width: 75em) 33vw,
          (min-width: 48em) 50vw,
          100vw"
          width={615}
          height={615}
          alt={productData.name}
          priority
        />
      )}
    </ImageWrapper>
  )

  if (isSinglePage) {
    return imageWrapperComponent
  }

  return (
    <NextLink href={`/shop/${categoryHandle}/${productData.slug}`}>
      {imageWrapperComponent}
    </NextLink>
  )
}
