import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function GetCustomer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { customerId } = req.body

    if (!customerId) {
      throw new Error('Missing customerId')
    }

    const { data: customerData } = await wooCommerceAPI.get(`customers/${customerId}`)

    return res.status(200).json(customerData)
  } catch (error) {
    console.log('GetCustomer Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(GetCustomer)
