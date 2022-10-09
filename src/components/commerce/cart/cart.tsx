import { Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/solid'
import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { ShoppingBagIcon } from '~/components/common/icons'
import { useCart } from '~/context'
import { useCheckout } from '~/hooks'
import { ButtonWithArrow } from '~/ui'
import { formatMoney } from '~/utilities'

import { EmptyCart } from './EmptyCart'

// import { LogoIcon, PlusIcon } from '~/icons'

export const Cart = () => {
  const { cartModalOpen, closeCartModal } = useCart()
  const { cart } = useCart()
  const { removeFromCart } = useCheckout()
  const router = useRouter()

  const isProhibitedRoute = ['/checkout', '/cart'].includes(router.pathname)

  return (
    <Transition.Root show={cartModalOpen && !isProhibitedRoute} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[100]" onClose={closeCartModal}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="absolute inset-0 bg-gray-500/70 transition-opacity"
              // onMouseOver={closeCartModal}
            />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex w-[380px] max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="flex h-full w-screen max-w-[800px] flex-col bg-colorFifteen px-7 text-colorFourteen shadow-xl">
                <div className="mt-20 flex items-center justify-between">
                  <p className="text-xl font-bold text-colorFourteen">Shopping Bag</p>
                  <div className="flex items-center">
                    <NextLink href="/cart" className="p-2" id="cart-component-link">
                      <div className="relative">
                        <ShoppingBagIcon />
                        {cart.lineItems.length > 0 ? (
                          <div className="absolute top-[-4px] left-4 flex h-4 w-4 items-center justify-center rounded-full bg-colorTen text-colorFifteen">
                            <span className="text-xs">{cart.lineItems.length}</span>
                          </div>
                        ) : null}
                      </div>
                    </NextLink>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => {
                          return closeCartModal()
                        }}
                      >
                        <span className="sr-only">Close cart</span>
                        <PlusIcon className="h-10 w-10 rotate-45" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="my-8 h-full overflow-y-auto">
                  <div className="flow-root h-full">
                    {!cart.lineItems.length && <EmptyCart isCartComponent />}
                    <div role="list" className="grid gap-y-8">
                      {cart.lineItems.map(lineItem => {
                        return (
                          <div
                            key={lineItem.id}
                            className="grid grid-cols-[7fr_10fr] gap-x-4 text-colorSeven"
                          >
                            <div>
                              <NextImage
                                src={
                                  lineItem.image?.src ??
                                  '/assets/images/product-image-placeholder.svg'
                                }
                                alt={lineItem.image?.alt ?? lineItem.image?.name ?? 'Placeholder'}
                                height="150"
                                width="150"
                                className="aspect-1 h-full w-full rounded-md object-cover object-center"
                              />
                            </div>
                            <section>
                              <p className="p-0 pb-3 text-base font-bold text-colorFourteen">
                                {lineItem.product.name}
                              </p>
                              <section className="grid">
                                <div className="flex items-center justify-between">
                                  <p className="p-0 text-smallCheckout">
                                    {lineItem.attributes.find(item => {
                                      return item.name === 'Weight'
                                    }).option ?? 'N/A'}
                                  </p>
                                  <span className="text-smallCheckout font-semibold text-colorFourteen">
                                    x {lineItem.quantity}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <button
                                    type="button"
                                    className="text-smallCheckout underline"
                                    onClick={async () => {
                                      await removeFromCart(lineItem)
                                    }}
                                  >
                                    Remove
                                  </button>
                                  <p className="p-0 text-smallCheckout">
                                    {formatMoney(lineItem.price * lineItem.quantity)}
                                  </p>
                                </div>
                              </section>
                            </section>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Cart Footer */}
                {cart.lineItems.length > 0 && (
                  <div>
                    <span className="text-smallCheckout text-colorSeven">
                      Shipping and tax calculated at checkout
                    </span>
                    <hr className="my-2 border-t-2 border-black" />
                    <div className="flex justify-between">
                      <p className="p-0 text-base font-medium">Subtotal</p>
                      <p className="p-0 text-base">{formatMoney(cart.subtotal!)}</p>
                    </div>
                    <div className="py-8">
                      <ButtonWithArrow
                        center
                        className="w-full"
                        buttonVariant="fourth"
                        href="/checkout"
                      >
                        Checkout
                      </ButtonWithArrow>
                    </div>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
