/* eslint-disable complexity */
import { withSentry } from '@sentry/nextjs'
import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import {
  STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_ID
} from '~/constants'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
  telemetry: false,
  typescript: true
})

// We need to update the payment intent with cart items etc on the client most likely
async function CreatePaymentIntentApplePay(req: NextApiRequest, res: NextApiResponse) {
  // INFO: An initial payment intent is created here, and then it gets updated with the real amount and so on once the order is created in WooCommerce.
  const { orderInput } = req.body
  const {
    paymentGateway,
    paymentMethod,
    isExpressCheckout,
    amount,
    orderId,
    email,
    shipping,
    walletName
  } = orderInput

  console.log('CreatePaymentIntentApplePayshippppppppppp', orderInput)

  if (!orderInput) {
    return res.status(400).json({ error: 'Missing order input' })
  }

  if (!amount) {
    return res.status(400).json({
      error: 'Missing amount'
    })
  }

  console.log('Shipping', shipping)
  console.log('OrderIDD', orderId)

  try {
    const paramsOrder: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'aud',
      description: `Initial Payment Intent with order and using ${paymentGateway}`,
      metadata: {
        orderId,
        email,
        wallet: walletName,
        isExpressCheckout
      },
      statement_descriptor: 'Tucker Tub',
      receipt_email: email,
      // customer
      payment_method: paymentMethod,
      confirm: false // confirm on the client - not on the server - otherwise error that its already been confirmed!
    }

    // we set shipping on the client, not on the server as you can't set it in both places.

    const paramsNoOrder: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'aud',
      description: `Initial Payment Intent with no order and using ${paymentGateway}`,
      metadata: {
        orderId,
        email,
        wallet: walletName,
        isExpressCheckout
      },
      statement_descriptor: 'Tucker Tub',
      receipt_email: email ?? '',
      // customer
      payment_method: paymentMethod,
      confirm: false // confirm on the client - not on the server - otherwise error that its already been confirmed!
    }

    console.log('ApplesTRIPEparams', paramsOrder)

    const paymentIntent = await stripe.paymentIntents.create(
      orderId && email && shipping ? paramsOrder : paramsNoOrder
    )

    console.log('API stripe.paymentIntents.create', paymentIntent)

    const clientSecretCookie = cookie.serialize(
      STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_CLIENT_SECRET,
      paymentIntent.client_secret ?? '',
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.CART_COOKIE_MAX_AGE),
        sameSite: 'lax',
        path: '/'
      }
    )

    const paymentIntentIdCookie = cookie.serialize(
      STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_ID,
      paymentIntent.id ?? '',
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: Number(process.env.CART_COOKIE_MAX_AGE),
        sameSite: 'lax',
        path: '/'
      }
    )

    res.setHeader('Set-Cookie', [paymentIntentIdCookie, clientSecretCookie])

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentMethod: paymentIntent.id
    })
  } catch (error) {
    console.log('CreatePaymentIntentApplePay error', error)
    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(CreatePaymentIntentApplePay)
