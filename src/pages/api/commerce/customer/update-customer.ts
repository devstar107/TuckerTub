/* eslint-disable no-nested-ternary */
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function UpdateCustomer(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { customerId, customerInput } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer id' })
    }

    if (!customerInput) {
      return res.status(400).json({
        error: 'Missing customerInput'
      })
    }

    const { data: customerData } = await wooCommerceAPI.put(
      `customers/${customerId}`,
      customerInput
    )

    console.log('UpdatedcustomerData', customerData)

    return res.status(200).json(customerData)
  } catch (error) {
    console.log('UpdateCustomer Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(UpdateCustomer)
