/* eslint-disable no-nested-ternary */
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function UpdateOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderId, orderInput, orderEmail } = req.body

    console.log('UpdateOrderWooCommerceReqBody', req.body)

    if (!orderId) {
      return res.status(400).json({ error: 'Missing order id' })
    }

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

    // console.log('UpdateOrderOrderInput', orderInput)

    // Here we update the shipping line, because when we create the order initially, we do not have any shipping lines as the user has not choosen any. If we had to update a shipping line, we would need to provide the ID, otherwise another shipping line will be added to the array. This is a strange WooCommerce thing as its a PUT request.

    const updatedData = {
      orderId,
      ...orderInput,
      orderEmail
    }

    const { data: orderData } = await wooCommerceAPI.put(`orders/${orderId}`, updatedData)

    console.log('UpdatedOrderData', orderData)

    return res.status(200).json(orderData)
  } catch (error) {
    console.log('UpdateOrder Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(UpdateOrder)
