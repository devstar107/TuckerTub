/* eslint-disable no-use-before-define */
/* eslint-disable complexity */
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'
import { useAuth, useCart } from '~/context'
import { ButtonWithArrow } from '~/ui'
import type { ConfirmationSaveLaterRegisterSchemaInput } from '~/validation/confirmation-save-later-register.schema'
import { confirmationSaveLaterRegisterSchema } from '~/validation/confirmation-save-later-register.schema'

interface SaveDetailsProps {
  wooCommerceOrderData: any
}

export function SaveDetails(props: SaveDetailsProps) {
  const { wooCommerceOrderData } = props
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { login, user } = useAuth()
  const { abortController } = useCart()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [customerLinked, setCustomerLinked] = useState(false)

  console.log('Confirmation-ParsedOrder', wooCommerceOrderData)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset
  } = useForm<ConfirmationSaveLaterRegisterSchemaInput>({
    resolver: zodResolver(confirmationSaveLaterRegisterSchema),
    mode: 'all'
  })

  const containsErrorsPassword = Object.keys(errors).includes('password')

  const passwordValidation =
    !containsErrorsPassword && dirtyFields.password
      ? 'primary-input-isValid'
      : touchedFields.password && 'primary-input-isInvalid'

  useEffect(() => {
    async function linkCustomerToRecentOrderAction() {
      await linkCustomerToRecentOrder()
    }

    if (formSubmitted && user?.email) {
      console.log('1formSubmitted && user?.email', formSubmitted)
      console.log('2formSubmitted && user?.email', user?.email)
      linkCustomerToRecentOrderAction()
    }
  }, [formSubmitted, user])

  useEffect(() => {
    async function updateCustomerAddressAction() {
      await updateCustomerAddress()
    }

    if (customerLinked && user?.email) {
      updateCustomerAddressAction()
    }
  }, [customerLinked, user])

  async function updateCustomerAddress() {
    try {
      if (!user?.id || !user?.email) {
        throw new Error('User is not logged in')
      }

      const updatedCustomerInput = {
        first_name: wooCommerceOrderData?.shipping?.first_name,
        last_name: wooCommerceOrderData?.shipping?.last_name,
        shipping: {
          first_name: wooCommerceOrderData?.shipping?.first_name,
          last_name: wooCommerceOrderData?.shipping?.last_name,
          address_1: wooCommerceOrderData?.shipping?.address_1,
          address_2: wooCommerceOrderData?.shipping?.address_2,
          city: wooCommerceOrderData?.shipping?.city,
          country: wooCommerceOrderData?.shipping?.country,
          state: wooCommerceOrderData?.shipping?.state,
          postcode: wooCommerceOrderData?.shipping?.postcode,
          email: wooCommerceOrderData?.billing?.email,
          phone: wooCommerceOrderData?.shipping?.phone
        },
        billing: {
          first_name: wooCommerceOrderData?.shipping?.first_name,
          last_name: wooCommerceOrderData?.shipping?.last_name,
          address_1: wooCommerceOrderData?.shipping?.address_1,
          address_2: wooCommerceOrderData?.shipping?.address_2,
          city: wooCommerceOrderData?.shipping?.city,
          country: wooCommerceOrderData?.shipping?.country,
          state: wooCommerceOrderData?.shipping?.state,
          postcode: wooCommerceOrderData?.shipping?.postcode,
          email: wooCommerceOrderData?.billing?.email,
          phone: wooCommerceOrderData?.shipping?.phone
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/customer/update-customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: abortController?.signal,
          body: JSON.stringify({
            customerId: user.id,
            customerInput: updatedCustomerInput
          })
        }
      )

      if (!response.ok) {
        throw new Error('Error updating order with customer id')
      }

      const data = await response.json()

      localStorage.setItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO, JSON.stringify(data))
      setSuccessMessage('Successfully saved order address to your account!')
    } catch (error) {
      console.log('Confirmation-updateCustomerAddress Error', error)

      return setAuthErrorMessage('Something went wrong, please try agan')
    }

    return null
  }

  async function linkCustomerToRecentOrder() {
    try {
      if (!user?.id || !user?.email) {
        throw new Error('User is not logged in')
      }

      const updatedOrderInput = {
        customer_id: user.id
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/orders/update-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: abortController?.signal,
          body: JSON.stringify({
            orderId: wooCommerceOrderData.id,
            orderInput: updatedOrderInput,
            orderEmail: user?.email
          })
        }
      )

      if (!response.ok) {
        throw new Error('Error updating order with customer id')
      }

      setCustomerLinked(true)
      setSuccessMessage('Your order has been linked to your account... saving address for later...')
    } catch (error) {
      console.log('Confirmation-linkCustomerToRecentOrder Error', error)

      return setAuthErrorMessage('Something went wrong, please try agan')
    }

    return null
  }

  async function onSubmitForm(values: ConfirmationSaveLaterRegisterSchemaInput) {
    try {
      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      const registerUserValues = {
        email: wooCommerceOrderData?.billing.email,
        password: values.password
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify(registerUserValues),
        signal: abortController?.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/register`,
        responseOptions
      )
      const data = await response.json()

      console.log('CONFIRMATION-REGISTERDATA', data)

      if (data.success) {
        // toast.success('Registered!')
        login(data)
        reset()
        setSuccessMessage('Successfully registered... linking account to recent order...')
        setFormSubmitted(true)
      } else {
        throw new Error(data.data.errorCode)
      }
    } catch (error) {
      console.log('Confirmation-Register Error', error)
      if (error instanceof Error) {
        if (error.message === '38') {
          return setAuthErrorMessage('You have already saved your details to your account')
        }
      }

      return setAuthErrorMessage('Something went wrong, please try agan')
    }

    return null
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p>Set a password to create your account</p>
            <input
              type="password"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input my-6 ${passwordValidation}`}
              placeholder="Password"
              autoComplete="current-password"
              aria-label="Password"
              {...register('password')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsPassword && errors.password?.message}
            </p>
          </div>
          <div>
            <ButtonWithArrow buttonType="submit" buttonVariant="fourth">
              {isSubmitting ? 'Saving account...' : 'Save account'}
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
    </div>
  )
}
