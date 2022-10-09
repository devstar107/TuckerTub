/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'

import { useAuth, useCart, useOrder } from '~/context'
import { ButtonWithArrow } from '~/ui'

import { PaymentGateway } from '../checkout/checkout-view/pay-view'
import { SaveDetails } from './SaveForLater'
import { WooCommerceCart } from './WooCommerceCart'

interface SuccessProps {
  wooCommerceOrderData: any
  stripeCheckoutData: any
  paypalOrderData: any
}

export const Success = (props: SuccessProps) => {
  const { wooCommerceOrderData, stripeCheckoutData, paypalOrderData } = props

  const { resetCart } = useCart()
  const { resetOrder, setCheckoutView } = useOrder()

  useEffect(() => {
    resetCart()
    resetOrder()
    setCheckoutView({
      isEmailView: true,
      isOrderAddressView: false,
      isDeliveryView: false,
      isPayView: false,
      isConfirmedThankYouView: false,
      isIncompatibleShippingView: false
    })
  }, [])

  if (paypalOrderData) {
    return (
      <RenderPaypalThankYou
        paypalOrderData={paypalOrderData}
        wooCommerceOrderData={wooCommerceOrderData}
      />
    )
  }

  return (
    <RenderStripeThankYou
      stripeCheckoutData={stripeCheckoutData}
      wooCommerceOrderData={wooCommerceOrderData}
    />
  )
}

interface RenderPayPalThankYouProps {
  paypalOrderData: any
  wooCommerceOrderData: any
}

function RenderPaypalThankYou(props: RenderPayPalThankYouProps) {
  const { paypalOrderData, wooCommerceOrderData } = props
  const [saveButtonClicked, setSaveButtonClicked] = useState(false)
  const { user } = useAuth()

  function handleSaveForNextTime() {
    setSaveButtonClicked(true)
  }

  return (
    <section>
      <h1 className="text-title text-colorFourteen">Confirmed</h1>
      <section className="grid grid-cols-1 gap-20 lg:grid-cols-2">
        <section className="max-w-[440px] text-colorFourteen">
          <p className="text-lg font-bold text-colorFourteen">
            Thank you for shopping with Tucker Tub.
          </p>
          <p className="text-base font-medium">
            Your order has been confirmed. Order #{wooCommerceOrderData.id}.
          </p>
          <p className="py-8 text-base">
            An email confirmation has been sent to {wooCommerceOrderData.billing.email}
          </p>
          <div className="grid grid-cols-1 gap-8 text-md text-colorFourteen lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-lg font-bold">Delivery Details</p>
              <div className="pt-3">
                <p>
                  {wooCommerceOrderData.shipping.first_name}{' '}
                  {wooCommerceOrderData.shipping.last_name}
                </p>
                <p>{wooCommerceOrderData.shipping.phone}</p>
                <p>{wooCommerceOrderData.shipping.address_1}</p>
                <p>{wooCommerceOrderData.shipping.address_2}</p>
                <p>{wooCommerceOrderData.shipping.city}</p>
                <p>{wooCommerceOrderData.shipping.state}</p>
                <p>{wooCommerceOrderData.shipping.postcode}</p>
                <p>{wooCommerceOrderData.shipping.country}</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-lg font-bold">Shipping</p>
                <p className="pt-3">Standard</p>
              </div>
              <div>
                <p className="text-lg font-bold">Payment</p>
                <p className="pt-3">PayPal</p>
              </div>
            </div>
          </div>

          {/* {!user && ( */}
          <div className="py-8">
            <ButtonWithArrow
              buttonVariant="fourth"
              fullWidth
              onClick={handleSaveForNextTime}
              buttonStyles={{
                opacity: saveButtonClicked ? '0.5' : '1'
              }}
              disabled={saveButtonClicked}
            >
              Save details for next time
            </ButtonWithArrow>
          </div>
          {/* )} */}
          {saveButtonClicked && <SaveDetails wooCommerceOrderData={wooCommerceOrderData} />}
        </section>
        <WooCommerceCart wooCommerceOrderData={wooCommerceOrderData} />
      </section>
    </section>
  )
}

interface RenderStripeThankYouProps {
  stripeCheckoutData: any
  wooCommerceOrderData: any
}

function RenderStripeThankYou(props: RenderStripeThankYouProps) {
  const { stripeCheckoutData, wooCommerceOrderData } = props
  const [saveButtonClicked, setSaveButtonClicked] = useState(false)
  const { user } = useAuth()

  console.log('stripeCheckoutData', stripeCheckoutData)
  console.log('wooCommerceOrderData', wooCommerceOrderData)

  const usedPaymentMethod = stripeCheckoutData.charges.data[0].payment_method_details.type

  const currentPaymentMethod =
    usedPaymentMethod === PaymentGateway.AFTERPAY_CLEARPAY ? 'AfterPay' : 'Card'

  // console.log('usedPaymentMethod', usedPaymentMethod)

  const capitalizeCardBrand =
    stripeCheckoutData.charges.data?.[0].payment_method_details?.card?.brand
      .charAt(0)
      .toUpperCase() +
    stripeCheckoutData.charges.data?.[0].payment_method_details?.card?.brand.slice(1)

  function handleSaveForNextTime() {
    setSaveButtonClicked(true)
  }

  return (
    <>
      <h1 className="text-title text-colorFourteen">Confirmed</h1>
      <section className="grid grid-cols-1 gap-20 lg:grid-cols-2">
        <section className="max-w-[440px] text-colorFourteen">
          <p className="text-lg font-bold text-colorFourteen">
            Thank you for shopping with Tucker Tub.
          </p>
          <p className="text-base font-medium">
            Your order has been confirmed. Order #{wooCommerceOrderData.id}.
          </p>
          <p className="py-8 text-base">
            An email confirmation has been sent to {wooCommerceOrderData.billing.email}
          </p>
          <div className="grid grid-cols-1 gap-8 text-md text-colorFourteen lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-lg font-bold">Delivery Details</p>
              <div className="pt-3">
                <p>
                  {wooCommerceOrderData.shipping.first_name}{' '}
                  {wooCommerceOrderData.shipping.last_name}
                </p>
                <p>{wooCommerceOrderData.shipping.phone}</p>
                <p>{wooCommerceOrderData.shipping.address_1}</p>
                <p>{wooCommerceOrderData.shipping.address_2}</p>
                <p>{wooCommerceOrderData.shipping.city}</p>
                <p>{wooCommerceOrderData.shipping.state}</p>
                <p>{wooCommerceOrderData.shipping.postcode}</p>
                <p>{wooCommerceOrderData.shipping.country}</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-lg font-bold">Shipping</p>
                <p className="pt-3">Standard</p>
              </div>
              <div>
                <p className="text-lg font-bold">Payment</p>
                <p className="pt-3">
                  {currentPaymentMethod === 'AfterPay'
                    ? 'AfterPay'
                    : `${capitalizeCardBrand} ending 
                    ${stripeCheckoutData.charges.data?.[0].payment_method_details?.card?.last4}`}
                </p>
                <p className="pt-3">
                  {stripeCheckoutData.metadata.wallet === 'googlePay'
                    ? 'Google Pay'
                    : stripeCheckoutData.metadata.wallet === 'applePay'
                    ? 'Apple Pay'
                    : ''}
                </p>
              </div>
            </div>
          </div>
          {/* {!user && ( */}
          <div className="py-8">
            <ButtonWithArrow
              buttonVariant="fourth"
              fullWidth
              onClick={handleSaveForNextTime}
              buttonStyles={{
                opacity: saveButtonClicked ? '0.5' : '1'
              }}
              disabled={saveButtonClicked}
            >
              Save details for next time
            </ButtonWithArrow>
          </div>
          {/* )} */}
          {saveButtonClicked && <SaveDetails wooCommerceOrderData={wooCommerceOrderData} />}
        </section>
        <WooCommerceCart wooCommerceOrderData={wooCommerceOrderData} />
      </section>
    </>
  )
}
