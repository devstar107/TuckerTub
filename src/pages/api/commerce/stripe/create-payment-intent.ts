/* eslint-disable complexity */
import { withSentry } from '@sentry/nextjs'
import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { PaymentGateway } from '~/components/commerce/checkout/checkout-view/pay-view'
import {
  STRIPE_TUCKERTUB_AFTERPAY_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_AFTERPAY_PAYMENT_INTENT_ID,
  STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_ID,
  STRIPE_TUCKERTUB_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_PAYMENT_INTENT_ID
} from '~/constants'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
  telemetry: false,
  typescript: true
})

// We need to update the payment intent with cart items etc on the client most likely
async function CreatePaymentIntent(req: NextApiRequest, res: NextApiResponse) {
  // INFO: An initial payment intent is created here, and then it gets updated with the real amount and so on once the order is created in WooCommerce.
  const { orderInput } = req.body
  const { paymentGateway, amount, orderId, email, shipping } = orderInput

  console.log('shippppppppppp', orderInput)

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
      amount: Math.ceil(amount * 100),
      currency: 'aud',
      description: `Initial Payment Intent with order and using ${paymentGateway}`,
      metadata: {
        orderId,
        email
      },
      receipt_email: email,
      shipping: {
        name: `${shipping?.first_name} ${shipping?.last_name}`,
        phone: shipping?.phone,
        address: {
          line1: shipping?.address_1,
          line2: shipping?.address_2,
          postal_code: shipping?.postcode,
          city: shipping?.city,
          country: 'AU',
          state: shipping?.state
        }
      },
      // TODO: WE need the payment_method
      // payment_method: paymentMethod.id,
      payment_method_types:
        paymentGateway === PaymentGateway.AFTERPAY_CLEARPAY ? ['afterpay_clearpay'] : ['card'],
      // if afterpay, provide return url
      // return_url:
      //   paymentGateway === 'afterpay_clearpay' ? `${process.env.FRONTEND_URL}/cart` : undefined,
      confirm: false
    }

    const paramsNoOrder: Stripe.PaymentIntentCreateParams = {
      amount: Math.ceil(amount * 100),
      currency: 'aud',
      description: `Initial Payment Intent with no order and using ${paymentGateway}`,
      // payment_method: paymentMethod.id,
      payment_method_types:
        paymentGateway === PaymentGateway.AFTERPAY_CLEARPAY ? ['afterpay_clearpay'] : ['card'],
      // if afterpay, provide return url
      // return_url:
      //   paymentGateway === 'afterpay_clearpay' ? `${process.env.FRONTEND_URL}/cart` : undefined,
      confirm: false
    }

    console.log('STRIPEparams', paramsOrder)

    const paymentIntent = await stripe.paymentIntents.create(
      orderId && email && shipping ? paramsOrder : paramsNoOrder
    )

    // console.log('API stripe.paymentIntents.create', paymentIntent)

    // We keep cookies for both afterpay and card payment intent

    if (paymentGateway === PaymentGateway.AFTERPAY_CLEARPAY) {
      const clientSecretCookie = cookie.serialize(
        STRIPE_TUCKERTUB_AFTERPAY_PAYMENT_INTENT_CLIENT_SECRET,
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
        STRIPE_TUCKERTUB_AFTERPAY_PAYMENT_INTENT_ID,
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
    }

    if (paymentGateway === PaymentGateway.APPLEPAY) {
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
    }

    const clientSecretCookie = cookie.serialize(
      STRIPE_TUCKERTUB_PAYMENT_INTENT_CLIENT_SECRET,
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
      STRIPE_TUCKERTUB_PAYMENT_INTENT_ID,
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
    console.log('CreatePaymentIntent error', error)
    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(CreatePaymentIntent)
