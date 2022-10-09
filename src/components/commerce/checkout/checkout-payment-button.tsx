/* eslint-disable complexity */
import { useState, useEffect } from 'react'

import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  STRIPE_TUCKERTUB_AFTERPAY_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_PAYMENT_INTENT_CLIENT_SECRET,
  WOOCOMMERCE_TUCKERTUB_ORDER
} from '~/constants'
import { usePaypal } from '~/hooks'
import { ButtonWithArrow } from '~/ui'

import { PaymentGateway } from './checkout-view/pay-view'

interface CheckoutPaymentButtonProps {
  paymentGateway: PaymentGateway
}

export const CheckoutPaymentButton = (props: CheckoutPaymentButtonProps) => {
  const { paymentGateway } = props
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentComplete, setIsPaymentComplete] = useState(false)
  const stripe = useStripe()
  const elements = useElements()
  const { errorMessage } = usePaypal()
  const router = useRouter()

  const foundOrder = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_ORDER)
  const parsedOrder = JSON.parse(foundOrder ?? '{}')
  console.log('CheckoutPaymentButton parsedOrder', parsedOrder)

  const stripeClientSecretCookie = Cookies.get(STRIPE_TUCKERTUB_PAYMENT_INTENT_CLIENT_SECRET)!
  console.log('CardClientSecretCookie', stripeClientSecretCookie)

  const stripeAfterPayClientSecretCookie = Cookies.get(
    STRIPE_TUCKERTUB_AFTERPAY_PAYMENT_INTENT_CLIENT_SECRET
  )!

  useEffect(() => {
    router.events.on('routeChangeComplete', () => {
      setIsLoading(false)
    })

    return () => {
      router.events.off('routeChangeComplete', () => {
        setIsLoading(false)
      })
    }
  }, [router.events])

  async function handleCardPayment() {
    try {
      if (!stripe || !elements || !CardNumberElement) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return
      }

      setIsLoading(true)

      const { paymentIntent, error } = await stripe.confirmCardPayment(stripeClientSecretCookie, {
        payment_method: {
          card: elements.getElement(CardNumberElement)
        }
      })

      if (error || !paymentIntent) {
        console.log('handleCardPayment Error', error)
        return setMessage(error.message)
      }

      console.log('[paymentIntent]', paymentIntent)

      if (paymentIntent?.status === 'succeeded') {
        console.log('[paymentIntent] succeeded')
        setIsPaymentComplete(true)

        setMessage('')

        router.replace(
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation?result=${paymentIntent.id}${
            parsedOrder.id ? `&orderId=${parsedOrder.id && parsedOrder.id}` : ''
          }`
        )
      }
    } catch (err) {
      console.log('handlePaymentSubmitPayPal err', err)

      setMessage(err.message)
      return console.log('handlePaymentSubmitPayPal err', err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAfterpayPayment() {
    try {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return
      }

      setIsLoading(true)
      console.log('AfterPayClientSecretCookie', stripeClientSecretCookie)

      const { paymentIntent, error } = await stripe.confirmAfterpayClearpayPayment(
        stripeAfterPayClientSecretCookie,
        {
          payment_method: {
            billing_details: {
              name: `${parsedOrder.billing.first_name} ${parsedOrder.billing.last_name}`,
              email: parsedOrder.billing.email,
              phone: parsedOrder.billing.phone,
              address: {
                line1: parsedOrder.billing.address_1,
                line2: parsedOrder.billing.address_2,
                city: parsedOrder.billing.city,
                state: parsedOrder.billing.state,
                postal_code: parsedOrder.billing.postcode,
                country: 'AU'
              }
            },
            metadata: {
              orderId: parsedOrder.id
            }
          },
          return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation?return=true`
        }
      )

      if (error || !paymentIntent) {
        // console.log('Afterpay error', error)
        throw error
      }

      console.log('[afterPay paymentIntent]', paymentIntent)

      if (paymentIntent?.status === 'succeeded') {
        setIsPaymentComplete(true)
        router.replace(
          `/confirmation?result=${paymentIntent.id}${
            parsedOrder.id ? `&orderId=${parsedOrder.id && parsedOrder.id}` : ''
          }`
        )
      }
    } catch (error) {
      if (error.type === 'card_error' && error.code === 'amount_too_large') {
        return setMessage(
          'Your order total is too high for Afterpay. Please choose another payment method.'
        )
      }

      console.log('afterPay handlePaymentSubmit error', error)
      return setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePaypalPayment() {
    console.log('handlePaypalPayment')
    try {
      // TODO: Work here
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return
      }

      if (errorMessage) {
        return setMessage(errorMessage)
      }

      setIsLoading(true)
    } catch (error) {
      console.log('handlePaypalPayment error', error)
      return setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handlePayment() {
    if (!paymentGateway) {
      setMessage('Please select a payment method')
    }

    if (paymentGateway) {
      setMessage('')
    }

    if (paymentGateway === PaymentGateway.CARD) {
      return handleCardPayment()
    }

    if (paymentGateway === PaymentGateway.APPLEPAY) {
      return handleCardPayment()
    }

    if (paymentGateway === PaymentGateway.AFTERPAY_CLEARPAY) {
      return handleAfterpayPayment()
    }

    if (paymentGateway === PaymentGateway.PAYPAL) {
      return handlePaypalPayment()
    }

    return null
  }

  return (
    <>
      <ButtonWithArrow
        fullWidth
        buttonType="button"
        buttonVariant="fourth"
        disabled={!stripe || !elements || isLoading || isPaymentComplete}
        onClick={handlePayment}
      >
        {isLoading ? 'Confirming...' : 'Confirm & Pay'}
      </ButtonWithArrow>
      {message && (
        <div>
          <p className="p-0 text-colorThirteen">{message}</p>
        </div>
      )}
    </>
  )
}
