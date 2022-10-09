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

async function StripeRetrieveCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  try {
    const { session_id } = req.query as { session_id: string }
    if (!session_id) {
      return res.status(400).json({
        error: 'Missing session_id'
      })
    }

    if (typeof session_id === 'string' && !session_id.startsWith('cs_')) {
      console.log('session_idsession_idsession_id', session_id)
      throw new Error('Invalid checkout session id provided')
    }

    if (typeof session_id === 'string') {
      const checkoutSession = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['payment_intent']
      })

      return res.status(200).json(checkoutSession)
    }

    return res.status(400).json({
      error: 'Invalid session_id'
    })
  } catch (error) {
    console.log('StripeRetrieveCheckoutSession error', error)
    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(StripeRetrieveCheckoutSession)
