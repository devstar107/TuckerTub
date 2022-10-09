/* eslint-disable no-use-before-define */
import { useState } from 'react'

import { usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useRouter } from 'next/router'

import { WOOCOMMERCE_TUCKERTUB_ORDER } from '~/constants'
import { useAuth, useCart, useOrder } from '~/context'

// Amount needs to be the same as the lineItems, but how do we pass the taxes from WooCommerce then?

export const usePaypal = () => {
  const { abortController, cart } = useCart()
  const { shippingMethod } = useOrder()
  const { user } = useAuth()
  const router = useRouter()
  const [{ options }] = usePayPalScriptReducer()

  const [errorMessage, setErrorMessage] = useState('')
  const foundOrder = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_ORDER)
  const parsedOrder = JSON.parse(foundOrder ?? '{}')
  const amount = cart?.subtotal
  console.log('PayPalTotalCartAmount', amount)

  async function handlePaypalCreateOrder(data, actions) {
    console.log('parsedOrderPAYPAL', parsedOrder)
    try {
      const lineItems = cart.lineItems.map(item => {
        return {
          name: item.product.name,
          quantity: item.quantity,
          unit_amount: {
            currency_code: options.currency,
            value: item.price
          }
        }
      })

      if (!parsedOrder?.shipping_lines?.[0].total) {
        return handleOnCancel()
      }

      const firstShippingLine = parsedOrder.shipping_lines[0].total
      const shippingData = {
        address: {
          address_line_1: parsedOrder.shipping.address_1,
          address_line_2: parsedOrder.shipping.address_2,
          admin_area_1: parsedOrder.shipping.state,
          admin_area_2: parsedOrder.shipping.city,
          postal_code: parsedOrder.shipping.postcode,
          country_code: 'AU'
        },
        email_address: parsedOrder.email,
        phone_number: {
          national_number: parsedOrder.shipping.phone
        },
        name: {
          full_name: `${parsedOrder.shipping.first_name} ${parsedOrder.shipping.last_name}`
        },
        options: [
          {
            id: shippingMethod.id,
            label: shippingMethod.title,
            type: 'SHIPPING',
            selected: true,
            amount: {
              currency_code: options.currency,
              value: firstShippingLine.toString() ?? '0'
            }
          }
        ]
      }

      console.log('shipingData', shippingData)
      console.log('shippingMethodvvvvvvv', shippingMethod)

      const createdOrder = await actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: options.currency,
              value: amount?.toString() ?? '0',
              breakdown: {
                item_total: {
                  currency_code: options.currency ?? 'AUD',
                  value: amount?.toString() ?? '0'
                }
              }
            },
            custom_id: parsedOrder.id,
            items: lineItems,
            shipping: shippingData
            // invoice_id: data.invoice_id
          }
        ]
        // payer: {

        // }
      })
      console.log('createdOrder', createdOrder)

      return createdOrder

      // return router.push(
      //   `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation?paypalOrderId=${createdOrder}`
      // )
    } catch (error) {
      console.log('PaypalButtonCreateOrder error', error)
      setErrorMessage(error.message)
    }
  }

  async function handleApproveOrder(order: any) {
    try {
      console.log('handleApproveOrderOrder', order)

      if (order.status !== 'COMPLETED') {
        throw new Error('Order not completed')
      }

      const wooCommerceOrderId = order.purchase_units?.[0].custom_id

      const updatedOrderInput = {
        payment_method: 'paypal',
        payment_method_title: 'PayPal',
        status: 'processing'
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/orders/update-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: abortController?.signal,
          body: JSON.stringify({
            orderId: wooCommerceOrderId,
            orderInput: updatedOrderInput,
            orderEmail: user?.email ?? parsedOrder.email
          })
        }
      )

      if (!response.ok) {
        throw new Error('Error updating order')
      }

      return router.push(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation?paypalOrderId=${order.id}`
      )
    } catch (error) {
      console.log('PaypalButtonHandleApproveOrder error', error)
      setErrorMessage(error.message)
    }
  }

  async function handleOnApprove(data, actions) {
    console.log('PayPal onApproveData', data)
    // console.log('PayPal onApproveActions', actions)
    try {
      const capturedOrder = await actions.order?.capture()
      console.log('capturedOrder', capturedOrder)
      await handleApproveOrder(capturedOrder)
    } catch (error) {
      console.log('PaypalButtonOnApprove error', error)
      setErrorMessage(error.message)
    }
  }

  async function handleOnCancel() {
    console.log('PayPal onCancel')
  }

  async function handleOnError(err: Record<string, unknown>) {
    console.log('PayPal onError', err)
    // router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation`)

    return setErrorMessage(err.message)
  }

  function handleOnShippingChange(data, actions) {
    console.log('PayPal onShippingChange', data, actions)
    if (data.shipping_address?.country_code !== 'AU') {
      return actions.reject()
    }

    return actions.resolve()
  }

  return {
    handlePaypalCreateOrder,
    handleOnApprove,
    handleOnCancel,
    handleOnError,
    handleOnShippingChange,
    errorMessage
  }
}
