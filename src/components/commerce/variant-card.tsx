/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
/* eslint-disable react/no-danger */

import { useState } from 'react'
// import { useInView } from 'react-intersection-observer'

import { useCart } from '~/context'
import { useCheckout } from '~/hooks'
import { ButtonWithArrow } from '~/ui'
import { formatMoney } from '~/utilities'

import { VariantAttribute } from './variant-attribute'

interface VariantCardProps {
  productData: any
  productVariants: any
}

export const VariantCard = (props: VariantCardProps) => {
  const { cart } = useCart()
  const { productData, productVariants } = props
  // console.log('productData props', productData.default_attributes)

  const findFirstVariantWithDefaultAttribute =
    productVariants.find(variant => {
      return variant.attributes.find(attribute => {
        const foundResult = productData.default_attributes.find(defaultAttribute => {
          // console.log('defaultAttribute', defaultAttribute.option)
          // console.log('attributeOption', attribute.option)
          // Work around because WooCommerce for whatever reason has a dash in some part of the API and no dash in other places.

          let defaultAttributeOption = defaultAttribute.option

          if (attribute.option.includes('-')) {
            defaultAttributeOption = defaultAttributeOption.replace('-', ' ')
          }

          if (attribute.option.includes('.')) {
            defaultAttributeOption = defaultAttributeOption.replace('-', '.')
          }

          // console.log('IsDefaultAttributeTheSame', replaceOptionDashWithSpace === attribute.option)
          return defaultAttributeOption === attribute.option
        })
        // console.log('FoundResult', foundResult)

        return foundResult
      })
    }) ?? null

  // console.log('FirstVariantWithDefaultAttribute', findFirstVariantWithDefaultAttribute)

  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(findFirstVariantWithDefaultAttribute)
  const { addToCart } = useCheckout()

  // console.log('productData.default_attributes', productData.default_attributes)
  // console.log('VARIANTCARDselectedVariant', selectedVariant)

  // const { ref, inView } = useInView({
  //   threshold: 0
  // })
  // const [isInView, setIsInView] = useState(true)

  const variationAttributes = productData.attributes.filter(attribute => {
    return attribute.variation === true
  })

  console.log('selectedVariant', selectedVariant)

  function handleSelectedVariant(variantOption: string) {
    const variantThatMatchesOption = productVariants.find(variant => {
      return variant.attributes.find(attribute => {
        return attribute.option === variantOption
      })
    })

    setSelectedVariant(prevState => {
      if (prevState === variantThatMatchesOption) {
        // if the variant is already selected, unselect it
        return null
      }

      return variantThatMatchesOption
    })
  }

  // not every variant has stock quantity or manages stock on a variation level.
  // So, I will only enable the early return if the selected variant manages stock on a variation level.

  // essentially this adds a nice feature if the variant has manage stock enabled, but original behavior if it does not have it enabled.
  function incrementQuantity() {
    if (selectedVariant?.manage_stock && selectedVariant?.stock_quantity > quantity) {
      setQuantity(prevState => {
        return prevState + 1
      })
    } else if (!selectedVariant?.manage_stock) {
      setQuantity(prevState => {
        return prevState + 1
      })
    }

    if (selectedVariant?.manage_stock && selectedVariant?.stock_quantity === quantity) {
      console.error('You cannot add more than the available stock.')
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      setQuantity(prevState => {
        return prevState - 1
      })
    }
  }

  // useEffect(() => {
  //   // TODO: Add this observer and fix later - because on initial load its false, and on render its true - which is not a good user experience.
  //   console.log('inView', inView)
  //   setTimeout(() => {
  //     setIsInView(inView)
  //   }, 1500)
  // }, [inView])

  return (
    <div>
      <h1 className="p-0 text-title text-colorFourteen">{productData.name}</h1>
      <div className="pt-8 pb-5 text-lg font-semibold">
        {selectedVariant?.sale_price ? (
          <div className="flex space-x-6 ">
            <p className="text-colorThirteen line-through ">
              {formatMoney(selectedVariant?.regular_price)}
            </p>
            <p>{formatMoney(selectedVariant?.sale_price)}</p>
          </div>
        ) : (
          <p>{formatMoney(selectedVariant?.price ?? productData.price)}</p>
        )}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: productData.short_description }}
        className="py-2 text-colorEight"
      />
      {variationAttributes.map(attribute => {
        return (
          <div key={attribute.id}>
            <h4>{attribute.name}:</h4>
            <div className="flex flex-wrap gap-5">
              {attribute.options.map(option => {
                const isAvailable = productVariants.find(variant => {
                  return variant.attributes.find(attribute => {
                    return attribute.option === option
                  })
                })

                return (
                  <VariantAttribute
                    key={option}
                    option={option}
                    selectedVariant={selectedVariant}
                    handleSelectedVariant={handleSelectedVariant}
                    isAvailable={isAvailable}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
      <div className="grid grid-cols-1 gap-5 py-8 sm:grid-cols-[1fr_3fr]">
        {/* quantity with plus and minus */}
        <div className="flex items-center ">
          <button
            type="button"
            onClick={decrementQuantity}
            className="rounded-md py-3 pr-4 text-center text-black"
          >
            -
          </button>
          <span className="rounded-lg bg-white px-6 py-3 text-lg font-semibold text-colorFourteen">
            {quantity}
          </span>
          <button
            type="button"
            onClick={incrementQuantity}
            className="rounded-md px-4 py-3 text-center text-black"
          >
            +
          </button>
        </div>
        {/* TODO: Fix forwardRef */}
        <ButtonWithArrow
          buttonType="button"
          buttonVariant="fourth"
          fullWidth
          disabled={
            !selectedVariant ||
            selectedVariant.stock_status === 'outofstock' ||
            selectedVariant.purchasable === false
          }
          onClick={() => {
            if (!selectedVariant) {
              // return toast.error('You must select a variant before you can add it to your cart.')
              return console.error('You must select a variant before you can add it to your cart.')
            }
            addToCart(selectedVariant, productData, quantity)
          }}
          // ref={intersectionRef}
        >
          {!selectedVariant
            ? 'Out of Stock'
            : selectedVariant.stock_status === 'outofstock'
            ? 'Out of Stock'
            : 'Add to Bag'}

          {/* {intersection.isIntersecting ? 'intersecting!' : 'not intersecting'} */}
        </ButtonWithArrow>

        {/* @ts-expect-error Type 'Ref<HTMLElement>' is not assignable to type 'LegacyRef<HTMLDivElement>' */}
        {/* <button type="button" ref={ref}>
          Add to Bag - Intersection:{' '}
        </button> */}
        {/* {isInView ? (
          <div
            className="fixed bottom-0 left-0 z-50 w-full bg-red-500 py-8 transition-all duration-500 ease-in-out"
            style={{
              transform: 'translateY(100%)'
            }}
          >
            <h2>{`Header inside viewport ${isInView}.`}</h2>
          </div>
        ) : (
          <div
            className="fixed bottom-0 left-0 z-50 w-full bg-red-500 py-8 transition-all duration-500 ease-in-out"
            style={{
              transform: 'translateY(0%)'
            }}
          >
            <h2>{`Header not inside viewport ${isInView}.`}</h2>
          </div>
        )} */}
      </div>
      {/* TODO: TEMPORARILY HIDE AFTERPAY */}

      {/* {selectedVariant && selectedVariant.purchasable === true && (
        <div className="space-x-4">
          <img src="/assets/icons/after-pay.svg" alt="Afterpay" className="inline-block" />
          <span className="text-smallCheckout text-colorSeven">
            4 interest-free payments of{' '}
            {formatMoney(
              selectedVariant.sale_price
                ? selectedVariant.sale_price / 4
                : selectedVariant.price / 4
            )}
          </span>
        </div>
      )} */}
      {productData.shipping_class === 'refrigerated' && (
        <div className="my-8 grid grid-cols-[1fr_5fr] rounded-lg bg-[#f6e4d7] p-5">
          <img src="/assets/icons/Delivery.svg" className="p-2" alt="Delivery" />
          <p className="text-colorEight">
            Our fresh range is currently only available for delivery within Melbourne metro and
            select regional areas of Victoria. National delivery coming soon.
          </p>
        </div>
      )}
    </div>
  )
}
