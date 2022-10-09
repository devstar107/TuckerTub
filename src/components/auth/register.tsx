/* eslint-disable complexity */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

import { useAuth } from '~/context'
import { ButtonWithArrow, Title } from '~/ui'
import type { RegisterSchemaInput } from '~/validation'
import { registerSchema } from '~/validation'

export const Register = () => {
  const [authErrorMessage, setAuthErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const { login } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset
  } = useForm<RegisterSchemaInput>({
    resolver: zodResolver(registerSchema),
    mode: 'all'
  })
  const containsErrorsFirstName = Object.keys(errors).includes('firstName')
  const containsErrorsLastName = Object.keys(errors).includes('lastName')
  const containsErrorsEmail = Object.keys(errors).includes('email')
  const containsErrorsPassword = Object.keys(errors).includes('password')
  const firstNameValidation =
    !containsErrorsFirstName && dirtyFields.firstName
      ? 'primary-input-isValid'
      : touchedFields.firstName && 'primary-input-isInvalid'
  const lastNameValidation =
    !containsErrorsLastName && dirtyFields.lastName
      ? 'primary-input-isValid'
      : touchedFields.lastName && 'primary-input-isInvalid'
  const emailValidation =
    !containsErrorsEmail && dirtyFields.email
      ? 'primary-input-isValid'
      : touchedFields.email && 'primary-input-isInvalid'
  const passwordValidation =
    !containsErrorsPassword && dirtyFields.password
      ? 'primary-input-isValid'
      : touchedFields.password && 'primary-input-isInvalid'

  async function onSubmitForm(values: RegisterSchemaInput) {
    try {
      if (authErrorMessage) {
        setAuthErrorMessage('')
      }

      console.log('REGISTEREDVALUES', values)

      const transformedValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify(transformedValues),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/register`,
        responseOptions
      )
      const data = await response.json()

      console.log('REGISTERDATA', data)

      if (data.success) {
        // toast.success('Registered!')
        login(data)
        reset()
        setSuccessMessage('Successfully registered!')
        router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/account/dashboard`)
      } else {
        throw new Error(data.data.errorCode)
      }
    } catch (error) {
      console.log('Register Error', error)
      if (error instanceof Error) {
        if (error.message === '38') {
          return setAuthErrorMessage('User already exists')
        }
      }

      setAuthErrorMessage('Something went wrong, please try agan')
    }
  }

  return (
    <section className="max-w-[440px]">
      <Title className="text-colorFourteen">Register</Title>
      <p className="py-8 text-base text-colorFourteen">
        Complete your details below to create a Tucker Tub account
      </p>
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
              placeholder="First name"
              autoComplete="given-name"
              aria-label="First name"
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
              placeholder="Last name"
              autoComplete="family-name"
              aria-label="Last name"
              {...register('lastName')}
            />
            <p className="p-0 text-colorThirteen">
              {containsErrorsLastName && errors.lastName?.message}
            </p>
          </div>
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
              {containsErrorsPassword && errors.password?.message}
            </p>
          </div>
          <div className="my-5 space-y-3">
            <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-full border-colorFourteen text-colorTen focus:ring-transparent"
                id="mailing-list"
              />
              <label htmlFor="mailing-list" className="text-base">
                Sign up for the Tucker Tub mailing list
              </label>
              <p className="p-0 text-colorThirteen">{errors.isSignUpEmail?.message}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded-full border-colorFourteen text-colorTen focus:ring-transparent"
                id="terms"
                {...register('isAgreedToTerms')}
              />
              <label htmlFor="terms" className="text-base">
                I agree to the{' '}
                <NextLink href="/policies/terms-and-conditions" className="underline">
                  Terms of Service
                </NextLink>
              </label>
            </div>
            <p className="p-0 text-colorThirteen">{errors.isAgreedToTerms?.message}</p>
          </div>
          <div>
            <ButtonWithArrow buttonType="submit" buttonVariant="primary">
              {isSubmitting ? 'Registering...' : 'Register'}
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
