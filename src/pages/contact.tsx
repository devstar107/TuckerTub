/* eslint-disable complexity */
import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Layout } from '~/components/common'
import { DropdownButtonSelect } from '~/components/contact/drop-down-btn'
import { RenderGoogleMaps } from '~/hooks'
import {
  CurveBanner,
  GradientWrap,
  Header,
  Title,
  Wrapper,
  Text,
  TextBold,
  ButtonWithArrow
} from '~/ui'

export interface IContactInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  questionType: string
  message: string
}

export default function Contact() {
  const [errorMessage, setErrorMessage] = useState('')

  const schema = z.object({
    firstName: z.string().min(1, 'Please enter a first name'),
    lastName: z.string().min(1, 'Please enter a last name'),
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address'
      })
      .min(1, 'Please enter an email address'),
    phone: z
      .string()
      .regex(/^[0-9]{8,10}$/, 'Please enter a valid phone number')
      .optional()
      .or(z.literal('')),
    questionType: z.string({
      required_error: 'Please select a question type'
    }),
    message: z.string().min(1, 'Please enter a message')
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, touchedFields, dirtyFields },
    reset,
    getValues
  } = useForm<IContactInput>({
    resolver: zodResolver(schema),
    mode: 'all'
  })

  async function onSubmitForm(values: IContactInput) {
    try {
      if (errorMessage) {
        setErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/contact`,
        responseOptions
      )

      if (response.ok) {
        // toast.success('Message sent!')
        console.log('Message sent!')
        reset()
      } else {
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.log('contact error', error)
      setErrorMessage('Something went wrong')
      if (error instanceof Error) {
        // toast.error(error.message)
        console.error(error.message)
      }
    }
  }

  const containsErrorsFirstName = Object.keys(errors).includes('firstName')
  const containsErrorslastName = Object.keys(errors).includes('lastName')
  const containsErrorsEmail = Object.keys(errors).includes('email')
  const containsErrorsPhone = Object.keys(errors).includes('phone')
  const containsErrorsQuestionType = Object.keys(errors).includes('questionType')
  const containsErrorsMessage = Object.keys(errors).includes('message')
  const firstNameValidation =
    !containsErrorsFirstName && dirtyFields.firstName
      ? 'primary-input-isValid'
      : touchedFields.firstName && 'primary-input-isInvalid'
  const lastNameValidation =
    !containsErrorslastName && dirtyFields.lastName
      ? 'primary-input-isValid'
      : touchedFields.lastName && 'primary-input-isInvalid'
  const emailValidation =
    !containsErrorsEmail && dirtyFields.email
      ? 'primary-input-isValid'
      : touchedFields.email && 'primary-input-isInvalid'
  const phoneValidation =
    !containsErrorsPhone && getValues().phone && getValues().phone.length > 0
      ? 'primary-input-isValid'
      : touchedFields.phone && containsErrorsPhone && 'primary-input-isInvalid'
  const questionTypeValidation =
    !containsErrorsQuestionType && dirtyFields.questionType
      ? 'primary-input-isValid'
      : errors.questionType && 'primary-input-isInvalid'
  const messageValidation =
    !containsErrorsMessage && dirtyFields.message
      ? 'primary-input-isValid'
      : touchedFields.message && 'primary-input-isInvalid'

  const phoneFields = { ...register('phone') }
  const {
    name: phoneName,
    ref: phoneRef,
    onBlur: phoneOnBlur,
    onChange: phoneOnChange
  } = phoneFields
  console.log('questionTypeValidation', questionTypeValidation)

  return (
    <>
      <NextSeo
        title="Contact | Tucker Tub"
        description="Contact Description"
        openGraph={{
          title: 'Contact | Tucker Tub',
          description: 'Contact Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />

      <Layout>
        <GradientWrap className="bg-colorFourteen">
          <CurveBanner>
            <Header className="text-colorFourteen">Contact</Header>
          </CurveBanner>
          <Wrapper>
            <div className="h-[200px]" />
            <div className="grid grid-cols-1 gap-20 py-20 text-colorFifteen lg:grid-cols-2 lg:gap-[146px]">
              <div className="space-y-5">
                <Title>Tucker Tub Pet Food</Title>
                <Text>All natural dog food, made farm fresh in Australia.</Text>
                <TextBold className="text-lg">Head Office & Production</TextBold>
                <div>
                  <p>218 High Street</p>
                  <p>BROADFORD VIC 3340</p>
                  <p>AUSTRALIA</p>
                </div>
                <div>
                  <Link href="/" className="underline">
                    <Text>(03) 5784 3541</Text>
                  </Link>
                </div>
                <div>
                  <Link href="/" className="underline">
                    <Text>woof@tuckertub.com.au</Text>
                  </Link>
                </div>
                <div className="my-12 max-h-[400px]">
                  <RenderGoogleMaps />
                </div>
              </div>
              <div className="max-w-[440px] space-y-5 sm:w-full">
                <Title>Ask a Question</Title>
                <Text>We'll woof right back!</Text>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <div className="grid grid-cols-1 space-y-3">
                    <div className="grid grid-cols-2 space-x-3">
                      <div>
                        <input
                          type="text"
                          style={{
                            boxShadow: 'none',
                            borderColor: 'transparent'
                          }}
                          className={`primary-input ${firstNameValidation}`}
                          placeholder="First name*"
                          autoComplete="name"
                          aria-label="First name"
                          {...register('firstName')}
                        />
                        <p className="p-0 text-red-500">{errors.firstName?.message}</p>
                      </div>
                      <div>
                        <input
                          type="text"
                          style={{
                            boxShadow: 'none',
                            borderColor: 'transparent'
                          }}
                          className={`primary-input ${lastNameValidation}`}
                          placeholder="Last name*"
                          autoComplete="name"
                          aria-label="Last name"
                          {...register('lastName')}
                        />
                        <p className="p-0 text-red-500">{errors.lastName?.message}</p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="email"
                        style={{
                          boxShadow: 'none',
                          borderColor: 'transparent'
                        }}
                        className={`primary-input ${emailValidation}`}
                        placeholder="Email*"
                        autoComplete="email"
                        aria-label="Email address"
                        {...register('email')}
                      />
                      <p className="p-0 text-red-500">{errors.email?.message}</p>
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
                        autoComplete="home tel"
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
                      <p className="p-0 text-red-500">{phoneValidation && errors.phone?.message}</p>
                    </div>
                    <div>
                      <DropdownButtonSelect
                        control={control}
                        questionTypeValidation={questionTypeValidation}
                      />
                      <p className="p-0 text-red-500">{errors.questionType?.message}</p>
                    </div>
                    <div>
                      <textarea
                        style={{
                          boxShadow: 'none',
                          borderColor: 'transparent'
                        }}
                        className={`primary-input ${messageValidation} h-[100px] resize-none rounded-lg p-2`}
                        placeholder="Message"
                        autoComplete="off"
                        aria-label="Message"
                        rows={5}
                        {...register('message')}
                      />
                      <p className="p-0 text-red-500">{errors.message?.message}</p>
                    </div>
                    <div>
                      <label htmlFor="contact-mailing-list" className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 rounded-full border-colorFourteen text-colorTen outline-none focus:ring-transparent"
                          id="contact-mailing-list"
                          name="checkbox"
                        />
                        Sign up for the Tucker Tub mailing list
                      </label>
                    </div>
                    <div>
                      <ButtonWithArrow buttonType="submit" buttonVariant="primary">
                        {isSubmitting ? 'Sending...' : 'Send'}
                      </ButtonWithArrow>
                    </div>
                    {errorMessage && (
                      <div>
                        <p className="p-0 text-red-500">{errorMessage}</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </Wrapper>
        </GradientWrap>
      </Layout>
    </>
  )
}
