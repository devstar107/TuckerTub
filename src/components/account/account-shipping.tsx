/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'
import { useAuth, useCart } from '~/context'
import type { Customer } from '~/types'
import { ButtonWithArrow } from '~/ui'
import type { AccountShippingInput } from '~/validation/account-shipping.schema'
import { accountShippingSchema } from '~/validation/account-shipping.schema'

export const AccountShipping = () => {
  const { user } = useAuth()
  const { abortController } = useCart()
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [customer, setCustomer] = useState<Customer | null>(null)

  async function fetchCustomer() {
    try {
      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        signal: abortController?.signal,
        body: JSON.stringify({
          customerId: user?.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/customer/get-customer`,
        responseOptions
      )
      const data = await response.json()

      console.log('fetchCustomerData', data)

      if (response.ok) {
        setCustomer(data)
      } else {
        throw new Error(data)
      }
    } catch (error) {
      console.log('fetchCustomer error', error)

      setAuthErrorMessage('Something went wrong')
    }
  }

  useEffect(() => {
    async function retrieveCustomer() {
      await fetchCustomer()
    }

    retrieveCustomer()
  }, [])

  console.log('AccountShipping-parsedCustomercustomerInfo', customer)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, touchedFields }
  } = useForm<AccountShippingInput>({
    resolver: zodResolver(accountShippingSchema),
    mode: 'all'
  })

  const watchValues = watch(['firstName', 'lastName', 'phone', 'address1', 'state', 'postcode'])
  const values = getValues()

  useEffect(() => {
    if (customer?.shipping?.first_name) {
      if (values.firstName?.length === 0) {
        setValue('firstName', customer?.shipping?.first_name)
      }

      if (values.lastName?.length === 0) {
        setValue('lastName', customer?.shipping?.last_name)
      }

      if (values.phone?.length === 0) {
        setValue('phone', customer?.shipping?.phone)
      }

      if (values.address1?.length === 0) {
        setValue('address1', customer?.shipping?.address_1)
      }

      if (values.address2?.length === 0) {
        setValue('address2', customer?.shipping?.address_2)
      }

      if (values.suburb?.length === 0) {
        setValue('suburb', customer?.shipping?.city)
      }

      if (values.state?.length === 0) {
        setValue('state', customer?.shipping?.state)
      }

      if (values.postcode?.length === 0) {
        setValue('postcode', customer?.shipping?.postcode)
      }

      if (values.phone?.length === 0) {
        setValue('phone', customer?.shipping?.phone)
      }
    }
  }, [customer])

  // console.log('Errorssssssss', errors)

  // console.log('watchValues', watchValues)

  const containsErrorsFirstName = Object.keys(errors).includes('firstName')
  const containsErrorsLastName = Object.keys(errors).includes('lastName')
  const containsErrorsPhone = Object.keys(errors).includes('phone')
  const containsErrorsAddress1 = Object.keys(errors).includes('address1')
  const containsErrorsPostcode = Object.keys(errors).includes('postcode')
  const containsErrorsState = Object.keys(errors).includes('state')
  const containsErrorsCountry = Object.keys(errors).includes('country')
  const firstNameValidation =
    !containsErrorsFirstName && watchValues[0]
      ? 'primary-input-isValid'
      : touchedFields.firstName && 'primary-input-isInvalid'
  const lastNameValidation =
    !containsErrorsLastName && watchValues[1]
      ? 'primary-input-isValid'
      : touchedFields.lastName && 'primary-input-isInvalid'
  const phoneValidation =
    !containsErrorsPhone && watchValues[2]
      ? 'primary-input-isValid'
      : touchedFields.phone && 'primary-input-isInvalid'
  const address1Validation =
    !containsErrorsAddress1 && watchValues[3]
      ? 'primary-input-isValid'
      : touchedFields.address1 && 'primary-input-isInvalid'
  const stateValidation =
    !containsErrorsState && watchValues[4]
      ? 'primary-input-isValid'
      : touchedFields.state && 'primary-input-isInvalid'
  const postcodeValidation =
    !containsErrorsPostcode && watchValues[5]
      ? 'primary-input-isValid'
      : touchedFields.postcode && 'primary-input-isInvalid'
  const countryValidation = !containsErrorsCountry && 'primary-input-isValid'

  async function onSubmitForm(values: AccountShippingInput) {
    try {
      const ifEmpty = watchValues.every(value => {
        return value === ''
      })

      if (ifEmpty) {
        return setAuthErrorMessage('Please fill out at least one field')
      }

      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      const updatedCustomerInput = {
        shipping: {
          first_name: values.firstName,
          last_name: values.lastName,
          address_1: values.address1,
          address_2: values.address2,
          city: values.suburb,
          postcode: values.postcode,
          state: values.state,
          country: values.country,
          phone: values.phone
        }
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify({
          customerId: user?.id,
          customerInput: updatedCustomerInput
        }),
        signal: abortController?.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/customer/update-customer`,
        responseOptions
      )
      const data = await response.json()

      console.log('AccountShipping-Data', data)

      if (response.ok) {
        setSuccessMessage('Your shipping details have been updated')
        localStorage.setItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO, JSON.stringify(data))
      } else {
        throw new Error(data)
      }
    } catch (error) {
      console.log('AccountShipping-Error', error)
      setSuccessMessage('')
      setAuthErrorMessage('Something went wrong')
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
    <section className="max-w-[440px]">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <input
              type="text"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${firstNameValidation}`}
              placeholder="First Name"
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
              placeholder="Last Name"
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
              placeholder="Phone"
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
              placeholder="Address Line 1"
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
          {/* TODO: Change to react-select and get data statically from custom api(?) */}
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
              placeholder="Postcode"
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

          <div>
            <ButtonWithArrow buttonType="submit" buttonVariant="primary">
              {isSubmitting ? 'Updating details...' : 'Update details'}
            </ButtonWithArrow>
          </div>
          {authErrorMessage && (
            <div>
              <p className="p-0 text-colorThirteen">{authErrorMessage}</p>
            </div>
          )}
          {successMessage && !authErrorMessage && (
            <div>
              <p className="p-0 text-colorTen">{successMessage}</p>
            </div>
          )}
        </div>
      </form>
    </section>
  )
}
