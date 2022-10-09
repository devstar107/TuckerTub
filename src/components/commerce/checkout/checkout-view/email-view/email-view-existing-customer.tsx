/* eslint-disable complexity */

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'
import { useAuth, useCart, useOrder } from '~/context'
import { ButtonWithArrow } from '~/ui'
import type { EmailViewExistingCustomerSchemaInput } from '~/validation/checkout-view-email-view-existing-customer.schema.ts'
import { emailViewExistingCustomerSchema } from '~/validation/checkout-view-email-view-existing-customer.schema.ts'

import { ApplePay } from '../../apple-pay'
import { CheckoutCart } from '../../checkout-cart'

interface EmailViewExistingCustomerProps {
  email: string
}
export const EmailViewExistingCustomer = (props: EmailViewExistingCustomerProps) => {
  const { email } = props
  const [errorMessage, setErrorMessage] = useState('')
  const { login, user } = useAuth()
  const { setCheckoutStep, cart, isExpressCheckout, abortController } = useCart()
  const { setCheckoutView, order, setOrder, setOrderEmail } = useOrder()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, touchedFields, dirtyFields, isValid }
  } = useForm<EmailViewExistingCustomerSchemaInput>({
    resolver: zodResolver(emailViewExistingCustomerSchema),
    mode: 'all'
  })

  const containsErrorsEmail = Object.keys(errors).includes('email')
  const containsErrorsPassword = Object.keys(errors).includes('password')

  const emailValidation =
    !containsErrorsEmail && dirtyFields.email
      ? 'primary-input-isValid'
      : touchedFields.email && 'primary-input-isInvalid'
  const passwordValidation =
    !containsErrorsPassword && dirtyFields.password
      ? 'primary-input-isValid'
      : touchedFields.password && 'primary-input-isInvalid'

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

  async function onSubmitForm(values: EmailViewExistingCustomerSchemaInput) {
    try {
      if (errorMessage) {
        setErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: abortController?.signal,
        body: JSON.stringify(values)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/get-jwt-token`,
        responseOptions
      )
      const data = await response.json()

      if (data.success) {
        // toast.success('Signed in!')
        login(data.data.jwt)
        if (response.ok) {
          setOrder({
            ...order
          })

          // get existing customer from localStorage if exists - saves API call

          const customerInfo = localStorage.getItem(
            WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO
          )

          if (customerInfo) {
            const parsedCustomerInfo = JSON.parse(customerInfo)
            console.log('parsedCustomerInfo', parsedCustomerInfo)

            if (parsedCustomerInfo?.id) {
              setOrderEmail(email)
              setCheckoutStep(2)
              return setCheckoutView({
                isEmailView: false,
                isOrderAddressView: true,
                isDeliveryView: false,
                isPayView: false,
                isConfirmedThankYouView: false,
                isIncompatibleShippingView: false
              })
            }
          }

          await getExistingCustomer()

          setOrderEmail(email)
          setCheckoutStep(2)
          setCheckoutView({
            isEmailView: false,
            isOrderAddressView: true,
            isDeliveryView: false,
            isPayView: false,
            isConfirmedThankYouView: false,
            isIncompatibleShippingView: false
          })
        }
      } else {
        throw new Error(data.data.message)
      }
    } catch (error) {
      console.log('email-view-existing-customer-error', error)
      if (error instanceof Error) {
        // toast.error(error.message)
        return setErrorMessage(error.message)
      }
      setErrorMessage('Something went wrong.')
    } finally {
      // reset()
    }
  }

  return (
    <section className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-[440px]">
        <div className="grid grid-cols-1 gap-1">
          <label htmlFor="checkout-email" className="py-2 text-lg font-bold text-colorFourteen">
            Sign In
          </label>
          <input
            id="checkout-email"
            type="email"
            style={{
              boxShadow: 'none',
              borderColor: 'transparent'
            }}
            className={`primary-input ${emailValidation}`}
            placeholder="Email address"
            autoComplete="email"
            aria-label="Email address"
            defaultValue={email}
            {...register('email')}
          />
          <p className="p-0 text-colorThirteen">{containsErrorsEmail && errors.email?.message}</p>
          <input
            type="password"
            style={{
              boxShadow: 'none',
              borderColor: 'transparent'
            }}
            className={`primary-input ${passwordValidation}`}
            placeholder="Password"
            autoComplete="current-password"
            aria-label="Password"
            {...register('password')}
          />
          <p className="p-0 text-colorThirteen">{passwordValidation && errors.password?.message}</p>
          <div>
            <NextLink
              href="/forgot-password"
              className="my-4 flex flex-1 items-center justify-end text-sm underline underline-offset-4"
            >
              Forgot Password?
            </NextLink>
          </div>
          <div>
            <ButtonWithArrow
              buttonType="submit"
              buttonVariant="fourth"
              className="w-full max-w-[65%] flex-1 justify-between rounded-lg text-lg sm:max-w-full"
              disabled={isSubmitting || !isValid}
              fullWidth
            >
              {isSubmitting ? 'Continuing...' : 'Continue to Shipping'}
            </ButtonWithArrow>
          </div>
          {errorMessage && (
            <div>
              <p className="p-0 text-colorThirteen">{errorMessage}</p>
            </div>
          )}

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
