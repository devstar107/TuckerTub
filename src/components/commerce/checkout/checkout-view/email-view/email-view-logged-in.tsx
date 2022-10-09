/* eslint-disable complexity */

import type { FormEvent } from 'react'
import { useState } from 'react'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'
import { useAuth, useCart, useOrder } from '~/context'
import { ButtonWithArrow } from '~/ui'

import { ApplePay } from '../../apple-pay'
import { CheckoutCart } from '../../checkout-cart'

export const EmailViewLoggedIn = () => {
  const { user, logout } = useAuth()
  const { setCheckoutView } = useOrder()
  const { setCheckoutStep, cart, isExpressCheckout, abortController } = useCart()
  const [isSubmit, setIsSubmit] = useState(false)

  async function getExistingCustomer() {
    try {
      console.log('getExistingCustomer-userId', user?.id)

      if (!user?.id) {
        throw new Error('User is not logged in')
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/customer/get-customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: abortController?.signal,
          body: JSON.stringify({
            customerId: user.id
          })
        }
      )

      if (!response.ok) {
        throw new Error('Error updating order with customer id')
      }

      const data = await response.json()

      localStorage.setItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO, JSON.stringify(data))
    } catch (error) {
      console.log('getExistingCustomer Error', error)
    }

    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault()
      setIsSubmit(true)

      await getExistingCustomer()
      setCheckoutStep(2)
      setCheckoutView({
        isEmailView: false,
        isOrderAddressView: true,
        isDeliveryView: false,
        isPayView: false,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    } catch (error) {
      console.log('handleSubmit Error', error)
      setIsSubmit(false)
    }
  }

  return (
    <section className="grid grid-cols-1 gap-20 pb-8 sm:grid-cols-2">
      <form onSubmit={handleSubmit} className="max-w-[440px]">
        <div className="grid grid-cols-1 gap-1">
          {user && (
            <h3 className="py-2 text-lg font-bold">
              Welcome back {user?.first_name ?? user?.username}!
            </h3>
          )}
          <p>
            Not you?{' '}
            <button
              type="button"
              onClick={() => {
                logout()
              }}
              className="underline"
            >
              Sign Out
            </button>
          </p>
          <div>
            <ButtonWithArrow
              buttonType="submit"
              buttonVariant="fourth"
              className="w-full max-w-[65%] flex-1 justify-between rounded-lg text-lg sm:max-w-full"
              fullWidth
              disabled={isSubmit}
            >
              {isSubmit ? 'Continuing...' : 'Continue'}
            </ButtonWithArrow>
          </div>

          {/* Apple Express Checkout */}
          {isExpressCheckout && (
            <div>
              <h3 className="text-colorFourteen">Express Checkout</h3>
            </div>
          )}
          {cart.lineItems.length > 0 ? <ApplePay /> : null}
        </div>
      </form>
      <section>
        <CheckoutCart />
      </section>
    </section>
  )
}
