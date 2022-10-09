import { WOOCOMMERCE_TUCKERTUB_ORDER } from '~/constants'

interface UpdateWooOrderProps {
  abortController: AbortController | null
  userEmail: string
  setOrder: (payload: any) => void
  selectedShippingMethod: any
}

export const updateWooOrder = async (orderData: UpdateWooOrderProps) => {
  const { abortController, userEmail, setOrder, selectedShippingMethod } = orderData

  try {
    const foundOrder = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_ORDER)
    const parsedOrder = JSON.parse(foundOrder ?? '{}')

    console.log('updateWooOrderPARSEDORDER', parsedOrder)

    const updatedShippingLine = [
      {
        method_id: selectedShippingMethod.id,
        method_title: selectedShippingMethod.title,
        total: selectedShippingMethod.total.value.toString()
      }
    ]

    const updatedOrderInput = {
      shipping: {
        ...parsedOrder.shipping
      },
      billing: {
        ...parsedOrder.billing
      },
      shipping_lines: [...updatedShippingLine]
    }

    console.log('ORDERIDDDDDDDDDDDDDDDDD_UpdateWooOrder', parsedOrder.id)

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/orders/update-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: abortController?.signal,
        body: JSON.stringify({
          orderId: parsedOrder.id,
          orderInput: updatedOrderInput,
          orderEmail: userEmail ?? parsedOrder.email
        })
      }
    )

    if (!response.ok) {
      throw new Error('Error updating order')
    }

    const data = await response.json()

    console.log('UpdatedORDERRRRRRRR', data)

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
      shippingOptions: parsedOrder.shippingOptions,
      total: data.total,
      email: userEmail
    }

    setOrder(updatedOrder)

    localStorage.setItem(WOOCOMMERCE_TUCKERTUB_ORDER, JSON.stringify(updatedOrder))

    return data
  } catch (error) {
    console.log('useUpdateWooOrder error', error)
  }
}
