/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useCart } from '~/context'
import { ButtonWithArrow, Title } from '~/ui'
import type { ForgotPasswordSchemaInput } from '~/validation'
import { forgotPasswordSchema } from '~/validation'

export const ForgotPassword = () => {
  const { abortController } = useCart()
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset
  } = useForm<ForgotPasswordSchemaInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'all'
  })

  const containsErrorsEmail = Object.keys(errors).includes('email')

  const emailValidation =
    !containsErrorsEmail && dirtyFields.email
      ? 'primary-input-isValid'
      : touchedFields.email && 'primary-input-isInvalid'

  async function onSubmitForm(values: ForgotPasswordSchemaInput) {
    try {
      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify({
          username: values.email
        }),
        signal: abortController?.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/forgot-password`,
        responseOptions
      )
      const data = await response.json()

      console.log('ResetForgotPasswordData', data)

      if (data.data.sendPasswordResetEmail) {
        // toast.success('Registered!')
        reset()
        setSuccessMessage('Success! Check your email for a link to reset your password.')
      } else {
        throw new Error(data.errors?.[0].message)
      }
    } catch (error) {
      console.log('ResetForgotPasswordError', error)
      setSuccessMessage('')
      if (error instanceof Error) {
        if (error.message.includes('There is no user registered with that email address')) {
          return setAuthErrorMessage(error.message)
        }
        // toast.error(error.message)
      }

      setAuthErrorMessage('Something went wrong')
    }
  }

  return (
    <section className="max-w-[440px]">
      <Title className="text-colorFourteen">Forgot Password</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 gap-3">
          <div className="my-4">
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
              {isSubmitting ? 'Processing...' : 'Forgot Password'}
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
