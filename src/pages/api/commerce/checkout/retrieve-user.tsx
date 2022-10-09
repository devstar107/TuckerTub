import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function RetrieveUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body

    const { data: customer } = await wooCommerceAPI.get(`customers?email=${email}`)

    if (!customer || customer.length === 0) {
      return res.status(200).json({
        status: 'customer not found'
      })
    }

    const foundCustomer = customer[0]

    return res.status(200).json(foundCustomer)
  } catch (error) {
    console.log('RetrieveUser Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(RetrieveUser)
