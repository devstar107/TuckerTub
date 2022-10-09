import { CheckoutCart } from '../checkout-cart'
import { CheckoutFormDelivery } from '../checkout-form-delivery'

export const OrderDeliveryView = () => {
  return (
    <section className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2">
      <CheckoutFormDelivery />
      <section>
        <CheckoutCart />
      </section>
    </section>
  )
}
