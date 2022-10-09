import { NextSeo } from 'next-seo'
import NextImage from 'next/future/image'

import { EmptyCart } from '~/components/commerce/cart/EmptyCart'
import { useCart } from '~/context'
import { useCheckout } from '~/hooks'
import { ButtonWithArrow, PageContainer } from '~/ui'
import { formatMoney } from '~/utilities'

export default function Cart() {
  const { cart } = useCart()
  const { removeFromCart, decrementQuantity, incrementQuantity } = useCheckout()

  return (
    <>
      <NextSeo
        title="Cart | Tucker Tub"
        description="Tucker Tub's Cart"
        openGraph={{
          title: 'Cart | Tucker Tub',
          description: "Tucker Tub's Cart",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <PageContainer>
        <h1 className="text-colorFourteen">Shopping Bag</h1>
        {!cart.lineItems.length && <EmptyCart />}
        <section className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div role="list" className="grid max-w-[440px] gap-y-8">
            {cart.lineItems.map(lineItem => {
              return (
                <div
                  key={lineItem.id}
                  className="grid grid-cols-[7fr_10fr] gap-x-4 text-colorSeven"
                >
                  <div>
                    <NextImage
                      src={lineItem.image?.src ?? '/assets/images/product-image-placeholder.svg'}
                      alt={lineItem.image?.alt ?? lineItem.image?.name ?? 'Placeholder'}
                      height={640}
                      width={640}
                      priority
                      className="h-full w-full rounded-md object-cover object-center"
                    />
                  </div>
                  <section>
                    <p className="p-0 font-bold text-colorFourteen">{lineItem.product.name}</p>

                    <section className="grid">
                      <div className="flex items-center justify-between">
                        <p className="p-0 py-3 text-base">
                          {lineItem.attributes.find(item => {
                            return item.name === 'Weight'
                          }).option ?? 'N/A'}
                        </p>
                        {/* <span className="font-medium text-colorFourteen">
                          x {lineItem.quantity}
                        </span> */}
                      </div>
                      <div className="flex  text-colorFourteen">
                        <button
                          type="button"
                          onClick={() => {
                            return decrementQuantity(lineItem)
                          }}
                          className="rounded-md py-3 pr-4 text-center text-black"
                        >
                          -
                        </button>
                        <span className="rounded-lg bg-white px-6 py-3 text-lg font-semibold text-colorFourteen">
                          {lineItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            return incrementQuantity(lineItem)
                          }}
                          className="rounded-md px-4 py-3 text-center text-black"
                        >
                          +
                        </button>
                      </div>
                      <div className="items-bottom flex justify-between pt-4 text-base">
                        <button
                          type="button"
                          className="underline"
                          onClick={async () => {
                            await removeFromCart(lineItem)
                          }}
                        >
                          Remove
                        </button>
                        <p className="p-0 text-lg font-semibold text-colorFourteen">
                          {formatMoney(lineItem.price * lineItem.quantity)}
                        </p>
                      </div>
                    </section>
                  </section>
                </div>
              )
            })}
          </div>
          <div>
            {cart.lineItems.length > 0 && (
              <div className="max-w-[440px]">
                <span className="text-base text-colorSeven">
                  Delivery options, costs and tax calculated at checkout
                </span>
                <hr className="my-2 border-t-2 border-black" />
                <div className="flex justify-between text-lg">
                  <p className="p-0 font-bold text-colorFourteen">Subtotal</p>
                  <p className="p-0 font-semibold text-colorFourteen">
                    {formatMoney(cart.subtotal)}
                  </p>
                </div>
                <div className="py-5">
                  <ButtonWithArrow
                    center
                    fullWidth
                    buttonVariant="fourth"
                    href="/checkout"
                    className="w-full"
                  >
                    Checkout
                  </ButtonWithArrow>
                </div>
                {/* TODO: TEMPORARILY HIDE AFTERPAY */}

                {/* <div className="space-x-4">
                  <NextImage src="/assets/icons/after-pay.svg" alt="Afterpay" className="inline-block" />
                  <span className="text-smallCheckout text-colorSeven">
                    4 interest-free payments of {formatMoney(cart?.subtotal / 4)}
                  </span>
                </div> */}
              </div>
            )}
          </div>
        </section>
      </PageContainer>
    </>
  )
}
