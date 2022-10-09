/* eslint-disable complexity */
/* eslint-disable no-nested-ternary */
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'
import { useAuth, useCart, useOrder } from '~/context'
import { ButtonWithArrow } from '~/ui'
import type { EmailViewSchemaInput } from '~/validation'
import { emailViewSchema } from '~/validation'

import { ApplePay } from '../../apple-pay'
import { CheckoutCart } from '../../checkout-cart'
import { EmailViewExistingCustomer } from './email-view-existing-customer'
import { EmailViewLoggedIn } from './email-view-logged-in'

export const EmailView = () => {
  const { user } = useAuth()
  const { setCheckoutStep, cart, isExpressCheckout } = useCart()
  const { setCheckoutView, order, setOrder, setOrderEmail } = useOrder()
  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [existingCustomerEmail, setExistingCustomerEmail] = useState('')
  const [existingCustomerEmailError, setExistingCustomerEmailError] = useState('')
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields, isValid }
  } = useForm<EmailViewSchemaInput>({
    resolver: zodResolver(emailViewSchema),
    mode: 'all'
  })

  const containsErrorsEmail = Object.keys(errors).includes('email')

  const emailValidation =
    !containsErrorsEmail && dirtyFields.email
      ? 'primary-input-isValid'
      : touchedFields.email && 'primary-input-isInvalid'

  async function onSubmitForm(values: EmailViewSchemaInput) {
    try {
      if (checkoutErrorMessage) {
        setCheckoutErrorMessage('')
      }

      const { email, isSignUpEmail } = values

      const checkForExistingUserOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/checkout/retrieve-user`,
        checkForExistingUserOptions
      )
      const data = await response.json()

      console.log('RetrieveCustomerDataaaaaaaaaa', data)

      if (response.ok) {
        setOrder({
          ...order
        })
        setOrderEmail(email)

        if (isSignUpEmail) {
          const subscribeOptions = {
            method: 'POST',
            body: JSON.stringify({
              email
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
          const subscribeResponse = await fetch(
            `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/subscribe`,
            subscribeOptions
          )

          const subscribeData = await subscribeResponse.json()

          if (subscribeData && subscribeData.error) {
            setExistingCustomerEmailError(subscribeData.error)
          }
        }

        if (data.status === 'customer not found') {
          console.log('CUSTOMERNOTFOUND')
          setCheckoutStep(2)
          setCheckoutView({
            isEmailView: false,
            isOrderAddressView: true,
            isDeliveryView: false,
            isPayView: false,
            isConfirmedThankYouView: false,
            isIncompatibleShippingView: false
          })
        } else {
          localStorage.setItem(
            WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO,
            JSON.stringify(data)
          )
          setExistingCustomerEmail(email)
          setIsExistingCustomer(true)
        }
      } else {
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.log('email-view-onSubmitForm error', error)
      setCheckoutErrorMessage('Something went wrong.')
      if (error instanceof Error) {
        // toast.error(error.message)
      }
    }
  }

  console.log('existingCustomer?', isExistingCustomer)

  if (user) {
    console.log('EmailView-EmailViewLoggedIn')
    return <EmailViewLoggedIn />
  }

  if (isExistingCustomer) {
    console.log('EmailView-EmailViewExistingCustomer')
    return <EmailViewExistingCustomer email={existingCustomerEmail} />
  }

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid max-w-[440px] grid-cols-1">
          <label htmlFor="checkout-email" className="pb-5 text-lg font-bold text-colorFourteen">
            Your Email
          </label>
          <div>
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
              disabled={isSubmitting}
              required={false}
              {...register('email')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsEmail ? errors.email?.message : existingCustomerEmailError || null}
            </p>
          </div>

          <div className="my-4 space-y-1">
            <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-full border-colorFourteen text-colorTen focus:ring-transparent"
                id="isSignUpEmail"
                {...register('isSignUpEmail')}
              />
              <label htmlFor="isSignUpEmail" className="text-base">
                Sign up for the Tucker Tub mailing list
              </label>
              <p className="p-0 text-colorThirteen">{errors.isSignUpEmail?.message}</p>
            </div>
          </div>
          <div className="py-8">
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
          {checkoutErrorMessage && (
            <div>
              <p className="p-0 text-colorThirteen">{checkoutErrorMessage}</p>
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
