/* eslint-disable camelcase */
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
  telemetry: false,
  typescript: true
})

// The purpose of this function is simply to check on the confirmation page to see if a valid Stripe payment has gone through, and if so, clear the cart.

async function StripeRetrievePaymentIntent(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  try {
    const { id } = req.query as { id: string }
    if (!id) {
      return res.status(400).json({
        error: 'Missing id'
      })
    }

    if (typeof id === 'string' && !id.startsWith('pi_')) {
      throw new Error('Invalid checkout session id provided')
    }

    if (typeof id === 'string') {
      const paymentIntent = await stripe.paymentIntents.retrieve(id)

      return res.status(200).json(paymentIntent)
    }

    return res.status(400).json({
      error: 'Invalid id'
    })
  } catch (error) {
    console.log('StripeRetrievePaymentIntent error', error)
    if (error instanceof Error) {
      return res.status(500).json({
        error: error?.message || error?.toString()
      })
    }

    return res.status(500).json({
      error: 'An unexpected error occurred'
    })
  }
}

export default withSentry(StripeRetrievePaymentIntent)
