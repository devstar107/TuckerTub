/* eslint-disable no-nested-ternary */
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function CreateOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderInput, orderEmail } = req.body
    // console.log('CreateOrder Cookies', req.cookies)
    console.log('Createorderorderinput', orderInput)

    if (!orderInput) {
      return res.status(400).json({
        error: 'Missing orderInput'
      })
    }

    if (!orderEmail) {
      return res.status(400).json({
        error: 'Missing orderEmail'
      })
    }

    const initialData = {
      // we'll process payment first in the next step so set_paid is set to false initially
      customer_id: orderInput.customerId,
      set_paid: orderInput.set_paid,
      billing: {
        ...orderInput.billing,
        email: orderEmail
      },
      shipping: orderInput.shipping,
      line_items: orderInput.line_items,
      payment_method: orderInput.payment_method,
      payment_method_title: orderInput.payment_method_title,
      shipping_lines: orderInput.shipping_lines ?? []
    }

    const { data: orderData } = await wooCommerceAPI.post('orders', initialData)

    console.log('orderData', orderData)

    return res.status(201).json(orderData)
  } catch (error) {
    console.log('CreateOrder Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(CreateOrder)
