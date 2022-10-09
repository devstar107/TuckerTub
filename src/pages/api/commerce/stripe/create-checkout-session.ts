import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
  telemetry: false,
  typescript: true
})

async function StripeCreateCheckoutSession(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  try {
    const { checkoutData, customerEmail } = req.body
    const { id: orderId } = checkoutData

    if (!checkoutData) {
      return res.status(400).json({
        error: 'Missing checkoutData'
      })
    }

    if (!customerEmail) {
      return res.status(400).json({
        error: 'Missing customerEmail'
      })
    }

    const lineItems = checkoutData.line_items.map(item => {
      const { name, price, quantity } = item
      return {
        price_data: {
          currency: 'aud',
          product_data: {
            name,
            images: [item.image.src || '']
          },
          unit_amount: Math.ceil(price * 100)
        },
        quantity
      }
    })

    const hasSubscription = lineItems.find(item => {
      return !!item.price_data.recurring
    })

    const params: Stripe.Checkout.SessionCreateParams = {
      submit_type: 'pay',
      mode: hasSubscription ? 'subscription' : 'payment',
      payment_method_types: ['card', 'afterpay_clearpay'],
      line_items: lineItems,
      customer_email: customerEmail,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        // Specify which shipping countries Checkout should provide as options for shipping locations
        allowed_countries: ['AU']
      },
      // metadata with orderId to update it in the webhook, as well as use in the thank you page
      metadata: {
        orderId
      },
      success_url: `${process.env.FRONTEND_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`

      // {CHECKOUT_SESSION_ID} will be replaced by the ID of the checkout session
    }

    const checkoutSession = await stripe.checkout.sessions.create(params)

    console.log('checkoutsession', checkoutSession)

    return res.status(200).json(checkoutSession)
  } catch (error) {
    console.log('StripeCreateCheckoutSession error', error)
    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(StripeCreateCheckoutSession)
