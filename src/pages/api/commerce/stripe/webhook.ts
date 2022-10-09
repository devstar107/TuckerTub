/* eslint-disable no-use-before-define */
/* eslint-disable complexity */
/* eslint-disable no-case-declarations */
import type { Readable } from 'stream'

import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { wooCommerceAPI } from '~/lib/WooCommerce'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
  telemetry: false,
  typescript: true
})

export const config = {
  api: {
    bodyParser: false
  }
}

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

// Good related docs: https://stripe.com/docs/payments/accept-a-payment?ui=elements&platform=web#fetch-updates
// Good related docs: https://stripe.com/docs/payments/afterpay-clearpay/accept-a-payment

async function StripeWebhook(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  try {
    const buf = await buffer(req)
    const signature = req.headers['stripe-signature'] ?? ''

    if (!signature) {
      console.log(`⚠️  Webhook signature verification failed.`)
      res.status(400).json({
        error: 'Webhook signature verification failed.'
      })
    }

    const event: Stripe.Event = stripe.webhooks.constructEvent(
      buf,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Extract the data from the event.
    const { data } = event
    const eventType: string = event.type

    const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent

    const session: Stripe.Checkout.Session = data.object as Stripe.Checkout.Session

    // Handle the events and add any business logic
    // for instance, sending an email to a customer

    switch (eventType) {
      case 'identity.verification_session.verified': {
        // All the verification checks passed
        const verificationSession = event.data.object
        console.log(`💰 ${eventType} - verification session ${verificationSession} verified!`)
        break
      }
      case 'payment_intent.created':
        console.log(`💰 payment_intent.created - Payment intent created: ${pi.id}`)
        break
      case 'payment_intent.processing':
        console.log(`💰 payment_intent.processing - Payment intent processing: ${pi.id}`)
        console.log(`💰 payment_intent.processing - Payment intent Status: "${pi.status}"`)
        break
      case 'payment_intent.succeeded':
        // Sent when a customer has successfully completed a payment.
        // The PaymentIntent transitions to succeeded.
        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
        console.log(`🔔 payment_intent.succeeded - Webhook received: ${pi.object}!`)
        console.log(`🔔 payment_intent.succeeded - Payment intent ${pi.id} succeeded!`)
        console.log(`💰 payment_intent.succeeded - Payment intent status: "${pi.status}"`)
        break
      case 'payment_intent.payment_failed':
        // Sent when a customer attempted a payment, but the payment failed.
        console.log(`🔔 payment_intent.payment_failed - Webhook received: ${pi.object}!`)
        console.log('❌ payment_intent.payment_failed - Payment failed.')
        console.log(`💰 payment_intent.payment_failed - Payment intent status: "${pi.status}"`)
        break
      case 'payment_intent.payment_canceled':
        console.log(`🔔 payment_intent.payment_canceled - Webhook received: ${pi.object}!`)
        console.log('❌ payment_intent.payment_canceled - Payment canceled.')
        console.log(`💰 payment_intent.payment_canceled - Payment intent status: "${pi.status}"`)
        break
      case 'charge.failed':
        console.log(`🔔 charge.failed - Webhook received: ${pi.object}!`)
        console.log('❌ charge.failed - Charge failed.')
        console.log(`💰 charge.failed - Payment intent status: "${pi.status}"`)

        await updateWooCommerceOrder({
          data: pi,
          status: 'failed',
          eventType: 'charge.failed',
          orderId: session.metadata!.orderId!
        })

        break
      case 'charge.succeeded':
        console.log(`🔔 charge.succeeded - Webhook received: ${pi.object}!`)
        console.log('✅ charge.succeeded - Charge succeeded.')
        console.log(`💰 charge.succeeded - Payment intent status: "${pi.status}"`)

        // The customer successfully authorized the payment by submitting the Checkout form on the web app

        console.log('Sesssssssssssssssssssssss', session)

        await updateWooCommerceOrder({
          status: 'processing',
          eventType: 'charge.succeeded',
          orderId: session.metadata!.orderId!,
          data: session
        })

        break
      case 'checkout.session.completed':
        console.log(`🔔 checkout.session.completed - Webhook received: ${pi.object}!`)

        // The customer successfully authorized the payment by submitting the external Stripe checkout form

        await updateWooCommerceOrder({
          data: pi,
          status: 'processing',
          eventType: 'checkout.session.completed',
          orderId: session.metadata!.orderId!
        })

        break
      default:
        console.log(`🔔 Default - Webhook received: ${eventType}`)
        console.log(`Unhandled event type ${eventType}`)
        break
    }

    res.status(200).end()
  } catch (error) {
    console.log('StripeWebHook error', error)

    return res.status(500).json({
      error: `Webhook error: ${error}`
    })
  }
}

export default withSentry(StripeWebhook)

type WooCommerceOrderStatus =
  | 'pending'
  | 'failed'
  | 'processing'
  | 'completed'
  | 'on-hold'
  | 'cancelled'
  | 'refunded'

type StripeEventType =
  | 'payment_intent.created'
  | 'payment_intent.processing'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'payment_intent.payment_canceled'
  | 'charge.failed'
  | 'charge.succeeded'
  | 'checkout.session.completed'

interface UpdateWooCommerceOrder {
  data: any
  status: WooCommerceOrderStatus
  orderId: string
  eventType: StripeEventType
}

async function updateWooCommerceOrder(input: UpdateWooCommerceOrder) {
  const { status, orderId, eventType, data } = input
  console.log('Webhookupdatewooorderdata', data)

  console.log('111111', data?.payment_method_details)

  const newData = {
    status,
    payment_method: data?.payment_method_details?.type,
    payment_method_title: data?.payment_method_details?.card?.brand,
    // transaction_id: data.id,
    refunds: data?.refunds,
    meta_data: [
      {
        key: '_stripe_intent_id',
        value: data.id
      }
    ]
  }

  console.log('updateWooCommerceOrder NewData', newData)

  // we get the orderId from metadata inside create-checkout-session - stripe.checkout.sessions.create
  const { data: updatedOrder } = await wooCommerceAPI.put(
    `orders/${orderId ?? data.metadata?.orderId}`,
    newData
  )

  console.log(`💰 ${eventType} - order updated to "${updatedOrder.status}"!`)
}

// We only handle processing and failed - the rest is up to the admin.

// WooCommerce order status: https://woocommerce.com/document/managing-orders/

// Pending payment — Order received, no payment initiated. Awaiting payment (unpaid).

// Failed — Payment failed or was declined (unpaid) or requires authentication (SCA). Note that this status may not show immediately and instead show as Pending until verified (e.g., PayPal).

// Processing — Payment received (paid) and stock has been reduced; order is awaiting fulfillment. All product orders require processing, except those that only contain products which are both Virtual and Downloadable.

// Completed — Order fulfilled and complete – requires no further action.

// On hold — Awaiting payment – stock is reduced, but you need to confirm payment.

// Canceled — Canceled by an admin or the customer – stock is increased, no further action required.

// Refunded — Refunded by an admin – no further action required.

// Authentication required — Awaiting action by the customer to authenticate the transaction and/or complete SCA requirements.
