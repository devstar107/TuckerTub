import { WooCommerceCart } from './WooCommerceCart'

interface FailureProps {
  wooCommerceOrderData: any
  stripeCheckoutData: any
  paypalOrderData: any
}

export const Failure = (props: FailureProps) => {
  const { wooCommerceOrderData, stripeCheckoutData, paypalOrderData } = props

  if (paypalOrderData) {
    return (
      <RenderPaypalFailure
        paypalOrderData={paypalOrderData}
        wooCommerceOrderData={wooCommerceOrderData}
      />
    )
  }

  return (
    <RenderStripeFailure
      stripeCheckoutData={stripeCheckoutData}
      wooCommerceOrderData={wooCommerceOrderData}
    />
  )
}

interface RenderPaypalFailureProps {
  paypalOrderData: any
  wooCommerceOrderData: any
}

function RenderPaypalFailure(props: RenderPaypalFailureProps) {
  const { paypalOrderData, wooCommerceOrderData } = props

  return (
    <div>
      <h1>Paypal Failure</h1>
    </div>
  )
}

interface RenderStripeFailureProps {
  stripeCheckoutData: any
  wooCommerceOrderData: any
}

function RenderStripeFailure(props: RenderStripeFailureProps) {
  const { stripeCheckoutData, wooCommerceOrderData } = props

  const usedPaymentMethod = stripeCheckoutData.payment_method_types

  const currentPaymentMethod = usedPaymentMethod.includes('afterpay_clearpay') ? 'AfterPay' : 'Card'

  return (
    <>
      <h1 className="text-title text-colorFourteen">Failure</h1>
      <section className="grid grid-cols-1 gap-20 lg:grid-cols-2">
        <section className="max-w-[440px] text-colorFourteen">
          <p className="text-lg font-bold text-colorFourteen">
            There was a problem with your order.
          </p>
          <p className="text-base font-medium">Your order is #{wooCommerceOrderData.id}.</p>
          <div className="grid grid-cols-1 gap-20 text-md text-colorFourteen lg:grid-cols-2">
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
                <p className="pt-3">{currentPaymentMethod}</p>
              </div>
            </div>
          </div>
        </section>
        <WooCommerceCart wooCommerceOrderData={wooCommerceOrderData} />
      </section>
    </>
  )
}
