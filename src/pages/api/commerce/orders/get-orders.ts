import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function GetOrders(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { customerId } = req.body

    if (!customerId) {
      throw new Error('Missing customer id')
    }

    const { data: orderData } = await wooCommerceAPI.get(`orders?customer=${customerId}`)

    return res.status(200).json(orderData)
  } catch (error) {
    console.log('GetOrders Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(GetOrders)
