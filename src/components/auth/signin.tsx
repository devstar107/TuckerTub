/* eslint-disable complexity */
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { useAuth } from '~/context'
import { ButtonWithArrow, Title } from '~/ui'
import type { LoginSchemaInput } from '~/validation'
import { loginSchema } from '~/validation'

export const SignIn = () => {
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { login } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset
  } = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
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

  async function onSubmitForm(values: LoginSchemaInput) {
    try {
      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/get-jwt-token`,
        responseOptions
      )
      const data = await response.json()

      if (data.success) {
        // toast.success('Signed in!')
        login(data.data.jwt)
        reset()
        setSuccessMessage('Successfully signed in!')
        router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/account/dashboard`)
      } else {
        throw new Error(data.data?.message)
      }
    } catch (error) {
      console.log('signin error', error)
      if (error instanceof Error) {
        return setAuthErrorMessage(error?.message)

        // toast.error(error.message)
      }

      setAuthErrorMessage('Something went wrong.')
    }
  }

  return (
    <section className="max-w-[440px]">
      <Title className="text-colorFourteen">Sign In</Title>
      <p className="py-8 text-base text-colorFourteen">
        Enter your email and password to access your account
      </p>
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
            <p className="p-0 text-colorThirteen">{emailValidation && errors.email?.message}</p>
          </div>
          <div>
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
            <p className="p-0 text-colorThirteen">
              {passwordValidation && errors.password?.message}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2">
            <ButtonWithArrow
              buttonType="submit"
              buttonVariant="fourth"
              className="w-[240px] flex-1 justify-between rounded-lg text-lg"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </ButtonWithArrow>
            <NextLink
              href="/forgot-password"
              className="flex flex-1 items-center justify-end text-sm underline underline-offset-4"
            >
              Forgot Password
            </NextLink>
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
