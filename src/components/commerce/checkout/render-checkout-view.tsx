import { useOrder } from '~/context'

import { EmailView } from './checkout-view/email-view/email-view'
import { IncompatibleShippingView } from './checkout-view/incompatible-shipping-view'
import { OrderAddressView } from './checkout-view/order-address-view'
import { OrderDeliveryView } from './checkout-view/order-delivery-view'
import { PayView } from './checkout-view/pay-view'

export const RenderCheckoutView = () => {
  const { checkoutView } = useOrder()

  if (checkoutView.isEmailView) {
    return <EmailView />
  }

  if (checkoutView.isOrderAddressView) {
    return <OrderAddressView />
  }

  if (checkoutView.isDeliveryView) {
    return <OrderDeliveryView />
  }

  if (checkoutView.isPayView) {
    return <PayView />
  }

  if (checkoutView.isIncompatibleShippingView) {
    return <IncompatibleShippingView />
  }

  if (checkoutView.isConfirmedThankYouView) {
    // move from thank you page to thank you component? It does some cool things on the server tho but...
    // return <ConfirmedThankYouView />

    return (
      <div>
        <h1>Hello from confirmed thank you view</h1>
      </div>
    )
  }

  return null
}
