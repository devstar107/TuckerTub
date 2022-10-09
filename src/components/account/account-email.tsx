/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useAuth, useCart } from '~/context'
import { ButtonWithArrow, Title } from '~/ui'
import type { AccountEmailSchemaInput } from '~/validation/account-email.schema'
import { accountEmailSchema } from '~/validation/account-email.schema'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '../../constants'
import type { Customer } from '../../types'

export const AccountEmail = () => {
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

  console.log('AccountEmail-parsedCustomercustomerInfo', customer)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting, touchedFields }
  } = useForm<AccountEmailSchemaInput>({
    resolver: zodResolver(accountEmailSchema),
    mode: 'all'
  })

  const watchValues = watch(['email'])
  const values = getValues()

  useEffect(() => {
    if (customer?.email) {
      if (values.email?.length === 0) {
        setValue('email', customer?.email)
      }
    }
  }, [customer])

  const containsErrorsEmail = Object.keys(errors).includes('email')

  const emailValidation =
    !containsErrorsEmail && watchValues[0]
      ? 'primary-input-isValid'
      : touchedFields.email && 'primary-input-isInvalid'

  async function onSubmitForm(values: AccountEmailSchemaInput) {
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
        email: values.email
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

      console.log('AccountEmail-Data', data)

      if (response.ok) {
        setSuccessMessage('Your email has been updated')
        localStorage.setItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO, JSON.stringify(data))
      } else {
        throw new Error(data)
      }
    } catch (error) {
      console.log('AccountEmail-Error', error)
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
              type="email"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${emailValidation}`}
              placeholder="Email address"
              autoComplete="email"
              aria-label="Email address"
              {...register('email')}
            />
            <p className="p-0 text-colorThirteen">{containsErrorsEmail && errors.email?.message}</p>
          </div>

          <div>
            <ButtonWithArrow buttonType="submit" buttonVariant="primary">
              {isSubmitting ? 'Updating email...' : 'Update email'}
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
