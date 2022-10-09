import NextLink from 'next/link'

import { useCart } from '~/context'
import { ButtonWithArrow } from '~/ui'

import { CheckoutCart } from '../checkout-cart'

/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
export const IncompatibleShippingView = () => {
  const { cart } = useCart()

  const refrigeratedItems = cart.lineItems.filter(item => {
    return item.shipping_class === 'refrigerated'
  })

  return (
    <section className="grid grid-cols-1 gap-20 lg:grid-cols-2">
      <div>
        <div className="text-colorFourteen">
          <h3>Sorry, there are no delivery options for your product selection to your location</h3>
          {refrigeratedItems.length > 0 && (
            <p>Please remove any fresh range products from your bag and try again</p>
          )}
        </div>
        {refrigeratedItems.length > 0 && (
          <div className="my-8 grid grid-cols-[1fr_5fr] rounded-lg bg-[#f6e4d7] p-5">
            <img src="/assets/icons/Delivery.svg" className="p-2" alt="Delivery" />
            <p className="text-colorEight">
              Our fresh range is currently only available for delivery within Melbourne metro and
              select regional areas of Victoria. National delivery coming soon.
            </p>
          </div>
        )}
        <div className="py-8">
          <ButtonWithArrow fullWidth href="/cart" buttonVariant="fourth" className="w-full">
            Return to Shopping Bag
          </ButtonWithArrow>
        </div>
        <div className="space-y-4 py-10">
          <p>
            More information on{' '}
            <NextLink href="/policies/shipping-and-delivery" className="underline">
              Shipping & Delivery
            </NextLink>
          </p>
        </div>
      </div>
      <section>
        <CheckoutCart />
      </section>
    </section>
  )
}
