/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'
import { useAuth, useCart } from '~/context'
import type { Customer } from '~/types'
import { ButtonWithArrow } from '~/ui'
import type { AccountUsernameSchemaInput } from '~/validation/account-username.schema'
import { accountUsernameSchema } from '~/validation/account-username.schema'

export const AccountUsername = () => {
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

  console.log('AccountUsername-parsedCustomercustomerInfo', customer)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, touchedFields }
  } = useForm<AccountUsernameSchemaInput>({
    resolver: zodResolver(accountUsernameSchema),
    mode: 'all'
  })

  const watchValues = watch(['firstName', 'lastName'])
  const values = getValues()

  useEffect(() => {
    if (customer?.first_name) {
      if (values.firstName?.length === 0) {
        setValue('firstName', customer?.first_name)
      }

      if (values.lastName?.length === 0) {
        setValue('lastName', customer?.last_name)
      }
    }
  }, [customer])

  // console.log('Errorssssssss', errors)

  // console.log('watchValues', watchValues)

  const containsErrorsFirstName = Object.keys(errors).includes('firstName')
  const containsErrorsLastName = Object.keys(errors).includes('lastName')

  const firstNameValidation =
    !containsErrorsFirstName && watchValues[0]
      ? 'primary-input-isValid'
      : touchedFields.firstName && 'primary-input-isInvalid'
  const lastNameValidation =
    !containsErrorsLastName && watchValues[1]
      ? 'primary-input-isValid'
      : touchedFields.lastName && 'primary-input-isInvalid'

  async function onSubmitForm(values: AccountUsernameSchemaInput) {
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
        first_name: values.firstName,
        last_name: values.lastName
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
        setSuccessMessage('Your name has been updated')
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
            <ButtonWithArrow buttonType="submit" buttonVariant="primary">
              {isSubmitting ? 'Updating name...' : 'Update name'}
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
