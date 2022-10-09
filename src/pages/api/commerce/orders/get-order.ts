import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function GetOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderId } = req.body

    if (!orderId) {
      throw new Error('Missing order id')
    }

    const { data: orderData } = await wooCommerceAPI.get(`orders/${orderId}`)

    return res.status(200).json(orderData)
  } catch (error) {
    console.log('GetOrder Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(GetOrder)
