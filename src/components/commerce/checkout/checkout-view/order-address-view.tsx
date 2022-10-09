/* eslint-disable no-nested-ternary */
import { useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import NextLink from 'next/link'
import { useForm } from 'react-hook-form'

import {
  WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO,
  WOOCOMMERCE_TUCKERTUB_ORDER
} from '~/constants'
import { useAuth, useCart, useOrder } from '~/context'
import { ButtonWithArrow } from '~/ui'
import { createWooOrder } from '~/utilities'
import { checkoutFormShippingSchema } from '~/validation'
import type { CheckoutFormShippingInput } from '~/validation'

import { CheckoutCart } from '../checkout-cart'

/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
export const OrderAddressView = () => {
  const { setCheckoutView, setOrder, orderEmail } = useOrder()
  const { setCheckoutStep, cart, abortController } = useCart()
  const { user } = useAuth()
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState('')
  const checkoutErrorRef = useRef<HTMLDivElement>(null)

  const customerInfo = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO)
  const parsedCustomerInfo = JSON.parse(customerInfo || '{}') ?? {}

  console.log('ORDERADDRESSVIEW-parsedCustomerInfo', parsedCustomerInfo)

  const preloadedValues = {
    firstName: parsedCustomerInfo?.first_name ?? '',
    lastName: parsedCustomerInfo?.last_name ?? '',
    address1: parsedCustomerInfo?.shipping?.address_1 ?? '',
    address2: parsedCustomerInfo?.shipping?.address_2 ?? '',
    suburb: parsedCustomerInfo?.shipping?.city ?? '',
    state: parsedCustomerInfo?.shipping?.state ?? '',
    postcode: parsedCustomerInfo?.shipping?.postcode ?? '',
    phone: parsedCustomerInfo?.shipping?.phone ?? ''
  }

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, touchedFields, dirtyFields }
  } = useForm<CheckoutFormShippingInput>({
    resolver: zodResolver(checkoutFormShippingSchema),
    mode: 'all',
    defaultValues: preloadedValues
  })

  const containsErrorsFirstName = Object.keys(errors).includes('firstName')
  const containsErrorsLastName = Object.keys(errors).includes('lastName')
  const containsErrorsPhone = Object.keys(errors).includes('phone')
  const containsErrorsAddress1 = Object.keys(errors).includes('address1')
  const containsErrorsPostcode = Object.keys(errors).includes('postcode')
  const containsErrorsState = Object.keys(errors).includes('state')
  const containsErrorsCountry = Object.keys(errors).includes('country')

  const firstNameValidation =
    !containsErrorsFirstName && getValues().firstName
      ? 'primary-input-isValid'
      : touchedFields.firstName && 'primary-input-isInvalid'
  const lastNameValidation =
    !containsErrorsLastName && getValues().lastName
      ? 'primary-input-isValid'
      : touchedFields.lastName && 'primary-input-isInvalid'
  const phoneValidation =
    !containsErrorsPhone && getValues().phone
      ? 'primary-input-isValid'
      : touchedFields.phone && 'primary-input-isInvalid'
  const address1Validation =
    !containsErrorsAddress1 && getValues().address1
      ? 'primary-input-isValid'
      : touchedFields.address1 && 'primary-input-isInvalid'
  const stateValidation =
    !containsErrorsState && getValues().state
      ? 'primary-input-isValid'
      : touchedFields.state && 'primary-input-isInvalid'
  const postcodeValidation =
    !containsErrorsPostcode && getValues().postcode
      ? 'primary-input-isValid'
      : touchedFields.postcode && 'primary-input-isInvalid'
  const countryValidation = !containsErrorsCountry && 'primary-input-isValid'

  console.log('dirtyFields', dirtyFields)
  console.log('touchedFields', touchedFields)
  console.log('errors', errors)

  async function onSubmitForm(values: CheckoutFormShippingInput) {
    try {
      if (checkoutErrorMessage) {
        setCheckoutErrorMessage('')
      }

      const shippingInformation = {
        shipping: {
          first_name: values.firstName ?? '',
          last_name: values.lastName ?? '',
          address_1: values.address1 ?? '',
          address_2: values.address2 ?? '',
          city: values.suburb ?? '',
          postcode: values.postcode ?? '',
          state: values.state ?? '',
          country: values.country ?? '',
          phone: values.phone ?? ''
        },
        billing: {
          first_name: values.firstName ?? '',
          last_name: values.lastName ?? '',
          address_1: values.address1 ?? '',
          address_2: values.address2 ?? '',
          city: values.suburb ?? '',
          postcode: values.postcode ?? '',
          state: values.state ?? '',
          country: values.country ?? '',
          phone: values.phone ?? ''
        }
      }

      console.log('postcodepostcodepostcode', values)

      console.log('CreatingWooOrderEmail', user?.email ?? orderEmail)

      const createdOrder = await createWooOrder({
        values,
        shippingInformation,
        cart,
        setCheckoutView,
        abortController,
        user,
        orderEmail: user?.email ?? orderEmail,
        setOrder
      })

      if (!createdOrder) {
        return
      }

      console.log('createedOrrrrrder', createdOrder)

      const foundOrder = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_ORDER)

      if (foundOrder) {
        setCheckoutStep(3)
        setCheckoutView({
          isEmailView: false,
          isOrderAddressView: false,
          isDeliveryView: true,
          isPayView: false,
          isConfirmedThankYouView: false,
          isIncompatibleShippingView: false
        })
      }
    } catch (error) {
      console.log('order-address-view-form error', error)

      // NOTE: Should scroll into view if error?
      setCheckoutErrorMessage('There was an error while creating your order.')

      if (checkoutErrorRef.current) {
        checkoutErrorRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
  const postCodeFields = { ...register('postcode') }
  const {
    name: postcodeName,
    ref: postcodeRef,
    onBlur: postcodeOnBlur,
    onChange: postcodeOnChange
  } = postCodeFields

  const phoneFields = { ...register('phone') }
  const {
    name: phoneName,
    ref: phoneRef,
    onBlur: phoneOnBlur,
    onChange: phoneOnChange
  } = phoneFields

  return (
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
      <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-[440px]">
        <p className="pb-5 text-lg font-bold text-colorFourteen">
          Where would you like to receive your order?
        </p>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <input
              type="text"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${firstNameValidation}`}
              placeholder="First Name*"
              autoComplete="shipping given-name"
              aria-label="First Name"
              {...register('firstName')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsFirstName && errors.firstName?.message}
            </p>
          </div>
          <div>
            <input
              type="text"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${lastNameValidation}`}
              placeholder="Last Name*"
              autoComplete="shipping family-name"
              aria-label="Last Name"
              {...register('lastName')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsLastName && errors.lastName?.message}
            </p>
          </div>
          <div>
            <input
              type="tel"
              maxLength={10}
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${phoneValidation}`}
              placeholder="Phone*"
              autoComplete="shipping home tel"
              aria-label="Phone"
              name={phoneName}
              ref={phoneRef}
              onBlur={phoneOnBlur}
              onChange={event => {
                const numericInput = event.target.value.replace(/\D/g, '')
                event.target.value = numericInput
                phoneOnChange(event)
              }}
            />
            <p className="p-0 text-colorThirteen">{containsErrorsPhone && errors.phone?.message}</p>
          </div>
          <div>
            <input
              type="text"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${address1Validation}`}
              placeholder="Address Line 1*"
              autoComplete="shipping address-line1"
              aria-label="Address Line 1"
              {...register('address1')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsAddress1 && errors.address1?.message}
            </p>
          </div>
          <input
            type="text"
            style={{
              boxShadow: 'none',
              borderColor: 'transparent'
            }}
            className="primary-input"
            placeholder="Address Line 2"
            autoComplete="shipping address-line2"
            aria-label="Address Line 2"
            {...register('address2')}
          />
          <input
            type="text"
            style={{
              boxShadow: 'none',
              borderColor: 'transparent'
            }}
            className="primary-input"
            placeholder="Suburb"
            autoComplete="shipping address-level2"
            aria-label="Suburb"
            {...register('suburb')}
          />
          {/* TODO: Change to react-select and get data statically from custom api */}
          <input
            type="text"
            style={{
              boxShadow: 'none',
              borderColor: 'transparent'
            }}
            className={`primary-input ${stateValidation}`}
            placeholder="State"
            autoComplete="shipping address-level1"
            aria-label="State"
            {...register('state')}
          />
          <div>
            <input
              type="text"
              maxLength={4}
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${postcodeValidation}`}
              placeholder="Postcode*"
              autoComplete="shipping postal-code"
              aria-label="Postcode"
              name={postcodeName}
              ref={postcodeRef}
              onBlur={postcodeOnBlur}
              onChange={event => {
                const numericInput = event.target.value.replace(/\D/g, '')
                event.target.value = numericInput
                postcodeOnChange(event)
              }}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsPostcode && errors.postcode?.message}
            </p>
          </div>
          <input
            type="text"
            style={{
              boxShadow: 'none',
              borderColor: 'transparent'
            }}
            className={`primary-input ${countryValidation}`}
            placeholder="Country"
            autoComplete="shipping country-name"
            aria-label="Country"
            value="Australia"
            {...register('country')}
          />
          {/* TODO: Add: this is also my billing address checkbox */}
          <div className="pt-8">
            <ButtonWithArrow
              buttonType="submit"
              buttonVariant="fourth"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Continuing...' : 'Continue to Shipping Options'}
            </ButtonWithArrow>
          </div>
          {checkoutErrorMessage && (
            <div>
              <p className="p-0 text-colorThirteen">{checkoutErrorMessage}</p>
            </div>
          )}
          <div className="space-y-4 py-5">
            <p>
              More information on{' '}
              <NextLink href="/policies/shipping-and-delivery" className="underline">
                Shipping & Delivery
              </NextLink>
            </p>
          </div>
        </div>
      </form>
      <section>
        <CheckoutCart />
      </section>
    </section>
  )
}
