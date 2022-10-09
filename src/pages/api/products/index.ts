import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function ProductHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data } = await wooCommerceAPI.get('products?status=publish&per_page=100')

    return res.status(200).json(data)
  } catch (error) {
    console.log('Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(ProductHandler)
