import { WOOCOMMERCE_TUCKERTUB_ORDER } from '~/constants'
import type { ICart } from '~/context/CartContext'
import type { LineItem } from '~/types'
import { checkCompatibleShippingZone } from '~/utilities'
import type { CheckoutFormShippingInput } from '~/validation'

interface CreateWooOrderProps {
  values: CheckoutFormShippingInput
  cart: ICart
  shippingInformation: any
  setCheckoutView: (payload: {
    isEmailView: boolean
    isOrderAddressView: boolean
    isDeliveryView: boolean
    isPayView: boolean
    isConfirmedThankYouView: boolean
    isIncompatibleShippingView: boolean
  }) => void
  abortController: AbortController | null
  user: any
  orderEmail: string
  setOrder: (payload: any) => void
}

export const createWooOrder = async (orderData: CreateWooOrderProps) => {
  const {
    values,
    cart,
    shippingInformation,
    setCheckoutView,
    abortController,
    user,
    orderEmail,
    setOrder
  } = orderData

  try {
    const compatibleShippingZone = checkCompatibleShippingZone(values, cart)
    console.log('createWooOrder_compatibleShippingZone', compatibleShippingZone)

    if (!compatibleShippingZone) {
      return setCheckoutView({
        isEmailView: false,
        isOrderAddressView: false,
        isDeliveryView: false,
        isPayView: false,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: true
      })
    }
    /* determine if we have free or standard shipping */

    const minifiedLineItems: LineItem[] = cart.lineItems.map(lineItem => {
      return {
        product_id: lineItem.id,
        quantity: lineItem.quantity
      }
    })

    const formattedOrderData = {
      ...shippingInformation,
      customerId: user?.id ?? 0,
      line_items: minifiedLineItems,
      cart
    }

    console.log('WooFormattedOrderData', formattedOrderData)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/orders/create-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: abortController?.signal,
        body: JSON.stringify({
          orderInput: formattedOrderData,
          orderEmail: user?.email ?? orderEmail
        })
      }
    )

    if (!response.ok) {
      throw new Error('Error creating order')
    }

    const data = await response.json()
    console.log('OrderCreatedData', data)

    const updatedOrder = {
      id: data.id,
      shipping: {
        ...data.shipping
      },
      billing: {
        ...data.billing
      },
      line_items: data.line_items,
      shipping_lines: data.shipping_lines,
      shippingOptions: compatibleShippingZone,
      total: data.total,
      email: user?.email ?? orderEmail
    }

    console.log('ADDRESSVIEWSHIPPINGOPTIONS', updatedOrder.shippingOptions)

    setOrder(updatedOrder)

    localStorage.setItem(WOOCOMMERCE_TUCKERTUB_ORDER, JSON.stringify(updatedOrder))

    return data
  } catch (error) {
    console.log('useCreateWooOrder error', error)
  }
}
