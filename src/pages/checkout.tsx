/* eslint-disable no-use-before-define */

import { useEffect } from 'react'

import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import { EmptyCart } from '~/components/commerce/cart/EmptyCart'
import Steps from '~/components/commerce/checkout/checkout-progress/steps'
import { RenderCheckoutView } from '~/components/commerce/checkout/render-checkout-view'
import { CheckoutChevronIcon } from '~/components/common'
import { useCart, useOrder } from '~/context'
import { Title, PageContainer } from '~/ui'

export default function Checkout() {
  const { setCheckoutView, checkoutView } = useOrder()
  const { cart, currentCheckoutStep, setCheckoutStep, abortController, setAbortController } =
    useCart()

  const router = useRouter()

  useEffect(() => {
    function clearCheckoutState() {
      setCheckoutStep(1)
      setCheckoutView({
        isEmailView: true,
        isOrderAddressView: false,
        isDeliveryView: false,
        isPayView: false,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    }

    router.events.on('routeChangeComplete', clearCheckoutState)

    return () => {
      router.events.off('routeChangeComplete', clearCheckoutState)
    }
  }, [router.events, setCheckoutStep, setCheckoutView])

  useEffect(() => {
    if (currentCheckoutStep === 1) {
      setCheckoutView({
        isEmailView: true,
        isOrderAddressView: false,
        isDeliveryView: false,
        isPayView: false,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    }

    if (currentCheckoutStep === 2) {
      setCheckoutView({
        isEmailView: false,
        isOrderAddressView: true,
        isDeliveryView: false,
        isPayView: false,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    }

    if (currentCheckoutStep === 3) {
      setCheckoutView({
        isEmailView: false,
        isOrderAddressView: false,
        isDeliveryView: true,
        isPayView: false,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    }

    if (currentCheckoutStep === 4) {
      setCheckoutView({
        isEmailView: false,
        isOrderAddressView: false,
        isDeliveryView: false,
        isPayView: true,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    }
  }, [currentCheckoutStep, setCheckoutView])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentCheckoutStep])

  useEffect(() => {
    if (checkoutView.isIncompatibleShippingView) {
      window.scrollTo(0, 0)
    }
  }, [checkoutView])

  return (
    <>
      <NextSeo
        title="Checkout | Tucker Tub"
        description="Checkout Description"
        openGraph={{
          title: 'Checkout | Tucker Tub',
          description: 'Checkout Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <PageContainer>
        {!cart.lineItems.length ? (
          <div className="">
            <h1 className="text-colorFourteen">Checkout</h1>
            <EmptyCart />
          </div>
        ) : (
          <div className="pb-6">
            <div className="relative">
              {currentCheckoutStep > 1 && (
                <button
                  type="button"
                  className="absolute top-1/2 left-[-1.5rem] -translate-x-1/2 -translate-y-1/2"
                  onClick={() => {
                    // abort any existing fetch requests if there are any
                    abortController?.abort()
                    setAbortController(new AbortController())
                    setCheckoutStep(currentCheckoutStep - 1)
                  }}
                >
                  <CheckoutChevronIcon className="h-6 w-6" />
                </button>
              )}
              {!checkoutView.isIncompatibleShippingView && <Steps />}
            </div>
            <Title className="m-auto py-6 text-colorFourteen">Checkout</Title>
            <RenderCheckoutView />
          </div>
        )}
      </PageContainer>
    </>
  )
}
