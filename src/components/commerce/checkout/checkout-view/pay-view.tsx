/* eslint-disable no-use-before-define */

import { useState } from 'react'

import NextLink from 'next/link'

import { CheckoutCart } from '~/components/commerce/checkout/checkout-cart'
import { WOOCOMMERCE_TUCKERTUB_ORDER } from '~/constants'
import { useAuth, useCart } from '~/context'

import { ApplePay } from '../apple-pay'
import { AfterPayDisclosure } from '../checkout-disclosure-AfterPay'
import { CreditCardDisclosure } from '../checkout-disclosure-CreditCard'
import { PaypalDisclosure } from '../checkout-disclosure-PayPal'
import { CheckoutPaymentButton } from '../checkout-payment-button'

export enum PaymentGateway {
  PAYPAL = 'PAYPAL',
  CARD = 'CARD',
  AFTERPAY_CLEARPAY = 'AFTERPAY_CLEARPAY',
  APPLEPAY = 'APPLEPAY'
}
export interface StripePaymentIntent {
  paymentGateway: PaymentGateway
  amount: number
  orderId?: string
  email?: string
  shipping?: any
}

export function PayView() {
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>(PaymentGateway.CARD)
  const [afterPayReady, setAfterPayReady] = useState(false)
  const [cardPayReady, setCardPayReady] = useState(false)
  const [applePayReady, setApplePayReady] = useState(false)
  const { user } = useAuth()
  const { abortController } = useCart()

  console.log('PayView User', user)

  const foundOrder = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_ORDER)
  const parsedOrder = JSON.parse(foundOrder ?? '{}')
  console.log('PayView parsedOrder', parsedOrder)

  if (!foundOrder) {
    return <div>Error: no order found in storage</div>
  }

  async function handleUpdatePaymentMethod(gateway: PaymentGateway) {
    console.log('parsedOrder.billing?.email', parsedOrder)

    const stripePaymentIntentResult = await createStripePaymentIntent({
      amount: parsedOrder.total,
      email: user?.email ?? parsedOrder.email,
      shipping: parsedOrder.shipping,
      orderId: parsedOrder.id,
      paymentGateway: gateway
    })
    console.log('stripePaymentIntentResult', stripePaymentIntentResult)
  }

  async function createStripePaymentIntent(orderInput: StripePaymentIntent) {
    console.log('createStripePaymentIntentorderInput', orderInput)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/stripe/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: abortController?.signal,
          body: JSON.stringify({
            orderInput
          })
        }
      )
      const data = await response.json()
      console.log('StripePaymentIntentResult', data)
      console.log('orderpaymentgateway', orderInput.paymentGateway)

      if (orderInput.paymentGateway === PaymentGateway.AFTERPAY_CLEARPAY) {
        setAfterPayReady(true)
      } else if (orderInput.paymentGateway === PaymentGateway.PAYPAL) {
        // not sure if we need this yet
      } else if (orderInput.paymentGateway === PaymentGateway.CARD) {
        setCardPayReady(true)
        setApplePayReady(true)
      }

      return data
    } catch (error) {
      console.log('createStripePaymentIntent error', error)
      throw new Error(error)
    }
  }
  function handleChoosePaymentMethod(paymentMethod: PaymentGateway) {
    setPaymentGateway(paymentMethod)

    if (paymentMethod !== PaymentGateway.PAYPAL) {
      handleUpdatePaymentMethod(paymentMethod)
    }
  }

  return (
    <div className="min-h-inherit bg-colorFifteen text-colorFourteen">
      <p className="pb-5 text-lg font-bold text-colorFourteen">How would you like to pay?</p>
      <section className="grid grid-cols-1 gap-20 sm:grid-cols-2 lg:gap-40">
        <div>
          <div className="space-y-6">
            <ApplePay />
            <CreditCardDisclosure
              paymentGateway={paymentGateway}
              cardPayReady={cardPayReady}
              handleChoosePaymentMethod={handleChoosePaymentMethod}
            />
            {/* TODO: TEMPORARILY HIDE AFTERPAY */}
            {/* <AfterPayDisclosure
              handleChooseAfterPayPayment={handleChooseAfterPayPayment}
              paymentGateway={paymentGateway}
              afterPayReady={afterPayReady}
            /> */}
            <PaypalDisclosure
              paymentGateway={paymentGateway}
              handleChoosePaymentMethod={handleChoosePaymentMethod}
            />
          </div>
          <div className="py-8">
            <CheckoutPaymentButton paymentGateway={paymentGateway} />
          </div>
          <p className="text-base leading-6 text-colorEight">
            When you place an order you accept Tucker Tub{' '}
            <NextLink href="/policies/terms-and-conditions" className="underline">
              Terms of Service
            </NextLink>{' '}
            and confirm that you have read our{' '}
            <NextLink href="/policies/privacy-policy" className="underline">
              Privacy Policy
            </NextLink>
            .
          </p>
        </div>
        <CheckoutCart />
      </section>
    </div>
  )
}
