/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { ButtonWithArrow, Title } from '~/ui'
import type { ResetPasswordSchemaInput } from '~/validation'
import { resetPasswordSchema } from '~/validation'

export const ResetPassword = () => {
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset
  } = useForm<ResetPasswordSchemaInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'all'
  })

  const router = useRouter()

  const containsErrorsNewPassword = Object.keys(errors).includes('newPassword')

  const newPasswordValidation =
    !containsErrorsNewPassword && dirtyFields.newPassword
      ? 'primary-input-isValid'
      : touchedFields.newPassword && 'primary-input-isInvalid'

  async function onSubmitForm(values: ResetPasswordSchemaInput) {
    try {
      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify({
          newPassword: values.newPassword,
          key: router.query.key,
          email: router.query.email
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/change-password`,
        responseOptions
      )
      const data = await response.json()

      console.log('ResetForgotPasswordData', data)

      if (data.data.resetUserPassword) {
        // toast.success('Registered!')
        reset()
        setSuccessMessage('Password reset successfully!')
      } else {
        throw new Error(data.errors?.[0].message)
      }
    } catch (error) {
      console.log(error)
      setSuccessMessage('')
      if (error instanceof Error) {
        if (error.message.includes('Password reset link is invalid')) {
          return setAuthErrorMessage(error.message)
        }
        // toast.error(error.message)
      }
      setAuthErrorMessage('Something went wrong')
    }
  }

  return (
    <section className="max-w-[440px]">
      <Title className="py-4 text-colorFourteen">Reset Password</Title>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <input
              type="password"
              style={{
                boxShadow: 'none',
                borderColor: 'transparent'
              }}
              className={`primary-input ${newPasswordValidation}`}
              placeholder="New Password"
              autoComplete="new-password"
              aria-label="New Password"
              {...register('newPassword')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsNewPassword && errors.newPassword?.message}
            </p>
          </div>

          <div>
            <ButtonWithArrow buttonType="submit" buttonVariant="primary">
              {isSubmitting ? 'Processing...' : 'Confirm Reset Password'}
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
