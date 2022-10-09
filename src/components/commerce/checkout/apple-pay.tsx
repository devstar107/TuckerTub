/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react'

import { PaymentRequestButtonElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type { PaymentIntent } from '@stripe/stripe-js'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_ID,
  WOOCOMMERCE_TUCKERTUB_ORDER
} from '~/constants'
import { useAuth, useCart, useOrder } from '~/context'
import { checkCompatibleShippingZone, createWooOrder } from '~/utilities'
import { updateWooOrder } from '~/utilities/updateWooOrder'

import type { StripePaymentIntent } from './checkout-view/pay-view'
import { PaymentGateway } from './checkout-view/pay-view'

export const ApplePay = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentRequest, setPaymentRequest] = useState(null)
  const { order, setOrder, setCheckoutView } = useOrder()
  const { cart, abortController, isExpressCheckout } = useCart()
  const { user } = useAuth()
  const [paymentType, setPaymentType] = useState(null)
  const [successfulPaymentIntent, setSuccessfulPaymentIntent] = useState<PaymentIntent | null>(null)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null)

  const stripeClientSecretCookie = Cookies.get(
    STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_CLIENT_SECRET
  ) as string
  const stripePaymentMethodCookie = Cookies.get(
    STRIPE_TUCKERTUB_APPLEPAY_PAYMENT_INTENT_ID
  ) as string

  // console.log('stripeClientSecretCookie', stripeClientSecretCookie)

  const router = useRouter()
  const foundOrder = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_ORDER)
  const parsedOrder = JSON.parse(foundOrder ?? '{}')
  console.log('CheckoutPaymentButton parsedOrder', parsedOrder)

  console.log('ApplePaycurrentCheckoutStep', isExpressCheckout)

  async function createStripePaymentIntent(orderInput: StripePaymentIntent) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/stripe/create-payment-intent-applepay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // signal: abortController?.signal,
          body: JSON.stringify({
            orderInput
          })
        }
      )
      const data = await response.json()
      console.log('StripePaymentIntentResult', data)
      console.log('orderpaymentgateway', orderInput.paymentGateway)
      return data
    } catch (error) {
      console.log('ApplecreateStripePaymentIntent error', error)
      throw new Error(error)
    }
  }

  useEffect(() => {
    if (successfulPaymentIntent) {
      const path = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/confirmation?paymentIntentId=${successfulPaymentIntent.id}`

      router.replace(path)
    }
  }, [successfulPaymentIntent])

  useEffect(() => {
    async function checkIfCanMakePayment() {
      try {
        console.log('StripeAppleOrder', parsedOrder)

        const amount = Math.ceil(cart.subtotal * 100) ?? 0

        const payRequest = stripe?.paymentRequest({
          currency: 'aud',
          country: 'AU',
          requestPayerEmail: true,
          requestPayerName: true,
          requestShipping: true,
          requestPayerPhone: false,
          displayItems: cart.lineItems.map(lineItem => {
            return {
              label: lineItem.product.name,
              amount: Math.ceil(lineItem.price * 100)
            }
          }),
          total: {
            label: 'Total',
            amount
          }
        })

        payRequest?.canMakePayment().then(result => {
          if (result) {
            console.log('CANMAKEPAYMENT', result)

            const activePaymentMethod = Object.keys(result).find(key => {
              return result[key]
            })

            console.log('CANMAKEPAYMENT-activePaymentMethod', activePaymentMethod)

            setPaymentType(activePaymentMethod)
            setPaymentRequest(payRequest as any)
          }
        })

        payRequest?.on('paymentmethod', async event => {
          console.log('EVENT_paymentMethod', event)
          // console.log('1-PaymentMethodAmount', Math.ceil(cart.subtotal * 100))
          // console.log('2-PaymentMethodAmount', cart.subtotal)

          // Create order in WooCommerce

          const orderValues = {
            address1: event.shippingAddress?.addressLine?.[0] ?? '',
            address2: event.shippingAddress?.addressLine?.[1] ?? '',
            suburb: event.shippingAddress?.city ?? '',
            country: event.shippingAddress?.country ?? '',
            firstName: event.shippingAddress?.recipient?.split(' ')[0] ?? '',
            lastName: event.shippingAddress?.recipient?.split(' ')[1] ?? '',
            phone: event.shippingAddress?.phone ?? '',
            state: event.shippingAddress?.region ?? '',
            postcode: event.shippingAddress?.postalCode ?? ''
          }

          const wooCommerceShippingValues = {
            billing: {
              address_1: event.shippingAddress?.addressLine?.[0] ?? '',
              address_2: event.shippingAddress?.addressLine?.[1] ?? '',
              city: event.shippingAddress?.city ?? '',
              country: event.shippingAddress?.country ?? '',
              first_name: event.shippingAddress?.recipient?.split(' ')[0] ?? '',
              last_name: event.shippingAddress?.recipient?.split(' ')[1] ?? '',
              phone: event.shippingAddress?.phone ?? '',
              state: event.shippingAddress?.region ?? '',
              postcode: event.shippingAddress?.postalCode ?? ''
            },
            shipping: {
              address_1: event.shippingAddress?.addressLine?.[0] ?? '',
              address_2: event.shippingAddress?.addressLine?.[1] ?? '',
              city: event.shippingAddress?.city ?? '',
              country: event.shippingAddress?.country ?? '',
              first_name: event.shippingAddress?.recipient?.split(' ')[0] ?? '',
              last_name: event.shippingAddress?.recipient?.split(' ')[1] ?? '',
              phone: event.shippingAddress?.phone ?? '',
              state: event.shippingAddress?.region ?? '',
              postcode: event.shippingAddress?.postalCode ?? ''
            },
            shipping_lines: [
              {
                method_id: event.shippingOption?.id,
                method_title: event.shippingOption.label,
                total: (event.shippingOption?.amount / 100).toString() ?? '0'
              }
            ]
          }

          // Create order in WooCommerce

          const createdWooOrder = await createWooOrder({
            values: orderValues,
            shippingInformation: wooCommerceShippingValues,
            setCheckoutView,
            cart,
            abortController,
            user,
            orderEmail: user?.email ?? event.payerEmail,
            setOrder
          })

          console.log('LETcreatedWooOrder', createdWooOrder)

          const orderInput: StripePaymentIntent & {
            paymentMethod: string
            walletName: string
            isExpressCheckout: boolean
          } = {
            amount: Math.ceil(createdWooOrder.total * 100),
            paymentGateway: PaymentGateway.APPLEPAY,
            paymentMethod: event.paymentMethod.id,
            email: event.payerEmail,
            orderId: createdWooOrder?.id,
            shipping: event.shippingAddress,
            walletName: event.walletName,
            isExpressCheckout
          }

          console.log('paymentmethod-orderInput', orderInput)

          // Uses Next.js API route and creates a Stripe payment intent on the server

          const { clientSecret } = await createStripePaymentIntent(orderInput)
          console.log('clientSecret', clientSecret)

          // confirm payment intent on the client

          const { error: confirmError, paymentIntent } = await stripe!.confirmCardPayment(
            clientSecret,
            {
              payment_method: event.paymentMethod.id,
              shipping: {
                name: event.payerName ?? event.shippingAddress?.recipient ?? '',
                phone: event.shippingAddress?.phone,
                address: {
                  line1: event.shippingAddress?.addressLine?.[0] ?? '',
                  line2: event.shippingAddress?.addressLine?.[1] ?? '',
                  city: event.shippingAddress?.city,
                  state: event.shippingAddress?.region,
                  postal_code: event.shippingAddress?.postalCode,
                  country: event.shippingAddress?.country
                }
              }
            },
            {
              handleActions: false
            }
          )

          console.log('ApplePaymentIntent', paymentIntent)

          if (paymentIntent?.status === 'requires_action') {
            console.log('paymentIntentrequires_action')
            await stripe?.confirmCardPayment(stripeClientSecretCookie)
          }

          if (paymentIntent?.status === 'requires_payment_method') {
            console.log('1 requires_payment_method ifstatement')
            console.log('2 stripePaymentMethodCookie', stripePaymentMethodCookie)

            const { error, paymentIntent } = await stripe!.confirmCardPayment(
              stripeClientSecretCookie,
              {
                payment_method: stripePaymentMethodCookie
              },
              {
                handleActions: false
              }
            )

            if (error) {
              // The payment failed -- ask your customer for a new payment method.
            }

            if (paymentIntent?.status === 'succeeded') {
              // Update woocommerce order

              updateWooOrder({
                abortController,
                selectedShippingMethod,
                setOrder,
                userEmail: user?.email ?? event.payerEmail
              })

              event.complete('success')
              setSuccessfulPaymentIntent(paymentIntent)
            }
          }

          if (confirmError) {
            console.log('ApplePayconfirmError', confirmError)
            event.complete('fail')
            return
          }

          updateWooOrder({
            abortController,
            selectedShippingMethod,
            setOrder,
            userEmail: event.payerEmail ?? ''
          })

          event.complete('success')
          setSuccessfulPaymentIntent(paymentIntent)
        })

        payRequest?.on('cancel', () => {
          console.log('EVENT_Payment request was canceled')
        })

        payRequest?.on('token', event => {
          console.log('EVENT_ApplePay_token', event)

          // setShippingDetails(event?.shippingAddress as any)
          // setShippingOption(event?.shippingOption as any)
          // setName(event?.payerName as any)
          // setPhone(event?.payerPhone as any)
          // setEmail(event?.payerEmail as any)
          // setWallet(event?.walletName as any)
        })

        // Callback when the shipping option is changed.
        payRequest?.on('shippingoptionchange', async event => {
          console.log('EVENT_shippingoptionchange', event)
          event.updateWith({
            // total: {
            //   label: 'Total',
            //   amount: getTotal() * 100 + getStripeShippingPrice(event.shippingOption)
            // },
            status: 'success'
          })

          // TODO: might need this for selection of shipping method

          // let shippingMethod = cart?.shipping_rates?.filter(
          //   (method: any) => method?.rate_id == ev?.shippingOption?.id
          // )[0];
          // if (
          //   !shippingMethod &&
          //   (ev?.shippingOption?.id == "free_click_and_collect_adelaide" ||
          //     ev?.shippingOption?.id == "free_click_and_collect_brighton")
          // ) {
          //   cart?.shipping_rates?.filter(
          //     (method: any) => method?.rate_id == "local_pickup_plus"
          //   )[0];
          // }
          // await selectShippingMethod(shippingMethod);
          // ev.updateWith({
          //   status: "success",
          //   displayItems: cart?.items?.map((prod: any) => {
          //     return { label: prod?.name, amount: +prod?.prices?.price };
          //   }),
          //   total: {
          //     amount: +cart?.totals?.total_price + ev?.shippingOption?.amount,
          //     label: "Tucker Tub",
          //   },
          // });
        })

        payRequest?.on('shippingaddresschange', async event => {
          console.log('EVENT_shippingaddresschange', event)

          if (event.shippingAddress.country !== 'AU') {
            return event.updateWith({ status: 'invalid_shipping_address' })
          }

          // Fetching local JSON file from server to get shipping options
          // Update with supported shipping options

          const orderValues = {
            address1: event.shippingAddress?.addressLine?.[0] ?? '',
            address2: event.shippingAddress?.addressLine?.[1] ?? '',
            suburb: event.shippingAddress?.city ?? '',
            country: event.shippingAddress?.country ?? '',
            firstName: event.shippingAddress?.recipient?.split(' ')[0] ?? '',
            lastName: event.shippingAddress?.recipient?.split(' ')[1] ?? '',
            phone: event.shippingAddress?.phone ?? '',
            state: event.shippingAddress?.region ?? '',
            postcode: event.shippingAddress?.postalCode ?? ''
          }

          const compatibleShippingOptions = checkCompatibleShippingZone(orderValues, cart)

          console.log('compatibleShippingOptions', compatibleShippingOptions)

          if (!compatibleShippingOptions) {
            return event.updateWith({ status: 'invalid_shipping_address' })
          }

          console.log('shippingCHANGEEEEEEEEE', compatibleShippingOptions)
          console.log('shippingCHANGEMethods', compatibleShippingOptions?.shippingMethods)

          const activeShippingMethod =
            compatibleShippingOptions.shippingMethods.find(shippingMethod => {
              return (
                shippingMethod.freeShipping && cart?.subtotal >= shippingMethod.minAmount.amount
              )
            }) ??
            compatibleShippingOptions.shippingMethods.find(shippingMethod => {
              return shippingMethod.flatRate
            })

          setSelectedShippingMethod(activeShippingMethod)

          console.log('AftershippingCHANGEEEEEEActiveShipping', activeShippingMethod)

          const amount = Math.ceil(cart.subtotal * 100) ?? 0
          const shippingAmount = Math.round(activeShippingMethod.total.value * 100) ?? 0

          console.log('1-Amount??', amount)
          console.log('2-shippingAmount??', shippingAmount)

          event.updateWith({
            status: 'success',
            shippingOptions: [
              {
                id: activeShippingMethod.methodId,
                label: activeShippingMethod.title,
                amount: shippingAmount,
                // TODO: Detail should not be 3-5 days but it has a required value
                detail: 'Arrives in 3-5 days'
              }
            ],
            total: {
              label: 'Tucker Tub',
              amount: amount + shippingAmount
            }
          })
        })
      } catch (error) {
        console.error('checkIfCanMakePayment error', error)
      }
    }

    if (!stripe || !elements) {
      return
    }

    checkIfCanMakePayment()
  }, [stripe, elements])

  console.log('paymentRequest', paymentRequest)
  console.log('stripePaymentMethodCookie', stripePaymentMethodCookie)

  // if customer cannot make a payment, then we do not show any Google Pay / Apple Pay element

  if (!paymentRequest) {
    return null
  }

  return (
    <div>
      {paymentRequest && (
        <PaymentRequestButtonElement
          options={{
            style: {
              paymentRequestButton: {
                height: '44px',
                type: 'check-out'
              }
            },
            paymentRequest
          }}
        />
      )}
    </div>
  )
}
