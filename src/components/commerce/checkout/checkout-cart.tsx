/* eslint-disable complexity */
import NextImage from 'next/future/image'

import { EmptyCart } from '~/components/commerce/cart/EmptyCart'
import { useCart, useOrder } from '~/context'
import { ApplyButton } from '~/ui'
import { formatMoney } from '~/utilities'

export const CheckoutCart = () => {
  const { cart } = useCart()
  const { shippingMethod } = useOrder()

  console.log('TheOrderSHIPPINGMETHOD', shippingMethod)
  const hasActiveShippingMethod = Object.keys(shippingMethod).length > 0

  // We could get this value from a local JSON file even though the data would not otherwise be available as it would be a future step normally.
  const estimateShipping = cart?.subtotal >= 79.99 ? 0 : 8.95

  function calculateShippingCost() {
    let shippingCost = 0

    if (!hasActiveShippingMethod) {
      // if we have not selected a shipping method from OrderDeliveryView, then we estimate the shipping instead
      const isFreeShipping = estimateShipping === 0

      if (isFreeShipping) {
        return shippingCost
      }

      shippingCost = estimateShipping
      return shippingCost
    }

    // if we have selected a shipping method from OrderDeliveryView, then we use that instead
    if (hasActiveShippingMethod) {
      const isFreeShipping = shippingMethod.freeShipping === true

      if (isFreeShipping) {
        return shippingCost
      }

      const isPaidShipping = shippingMethod.freeShipping === false

      if (isPaidShipping) {
        shippingCost = shippingMethod.cost ?? shippingMethod.total?.value ?? 0
      }
    }

    return shippingCost
  }

  const shippingCost = calculateShippingCost() ?? ''

  console.log('shippingCost', shippingCost)
  console.log('cart.lineItems.length', cart.lineItems.length)

  return (
    <section role="list" className="grid max-w-[440px] auto-rows-[minmax(0,0.8fr)] pb-16">
      {!cart.lineItems.length && <EmptyCart />}
      {cart.lineItems.map(lineItem => {
        return (
          <div
            key={lineItem.id}
            className="grid grid-cols-[2fr_10fr] gap-x-4 text-smallCheckout text-colorSeven"
          >
            <div className="aspect-1 max-w-[100px]">
              <NextImage
                src={lineItem.image?.src ?? '/assets/images/product-image-placeholder.svg'}
                alt={lineItem.image?.alt ?? lineItem.image?.name ?? 'Placeholder'}
                height={1500}
                width={1500}
                priority
                className="h-full w-full max-w-[100px] rounded-md object-cover object-center"
              />
            </div>
            <section className="text-base">
              <p className="w-[70%] p-0 pb-3 text-base font-bold text-colorFourteen">
                {lineItem.product.name}
              </p>
              <section className="grid">
                <div className="flex items-center justify-between">
                  <p className="p-0">
                    {lineItem.attributes.find(item => {
                      return item.name === 'Weight'
                    }).option ?? 'N/A'}
                  </p>
                  <span className="font-semibold text-colorFourteen">x {lineItem.quantity}</span>
                </div>
                <div className="flex items-center justify-end">
                  <p className="p-0">{formatMoney(lineItem.price * lineItem.quantity)}</p>
                </div>
              </section>
            </section>
          </div>
        )
      })}
      <div>
        {cart.lineItems.length > 0 && (
          <div className="space-y-4 text-base text-colorFourteen">
            <div className="grid grid-cols-2 gap-4 lg:gap-10">
              <input
                type="text"
                placeholder="Coupon Code"
                className="primary-input placeholder:text-base placeholder:text-colorFourteen"
              />
              <ApplyButton buttonVariant="fifth" fullWidth>
                Apply
              </ApplyButton>
            </div>
            <div className="flex justify-between text-base">
              <p className="p-0 font-medium">Subtotal</p>
              <p className="p-0">{formatMoney(cart?.subtotal ?? 0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="p-0 font-medium">
                Shipping {hasActiveShippingMethod ? '' : '(Estimated)'}
              </p>
              <p className="p-0">
                {shippingCost === 0 ? 'FREE' : formatMoney(Number(shippingCost))}
              </p>
            </div>
            <hr className="my-2 border-t-2 border-black" />
            <div className="flex justify-between">
              <p className="p-0 text-lg font-bold">TOTAL</p>
              <p className="p-0 text-lg font-semibold">
                {shippingCost === 0
                  ? formatMoney(cart?.subtotal ?? 0)
                  : formatMoney(cart?.subtotal + Number(shippingCost))}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
