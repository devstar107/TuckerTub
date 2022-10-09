import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { EmailIcon } from '~/components/common/icons'

interface IFormInputs {
  email: string
}

export const Newsletter = () => {
  const [message, setMessage] = useState({
    type: '',
    text: ''
  })

  useEffect(() => {
    let timer: any

    if (message.type) {
      timer = setTimeout(() => {
        setMessage({
          type: '',
          text: ''
        })
      }, 3000)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [message])

  const schema = z.object({
    email: z
      .string()
      .email({
        message: 'A valid email must be provided'
      })
      .min(3, { message: 'A valid email must be provided' })
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<IFormInputs>({
    resolver: zodResolver(schema),
    mode: 'onBlur'
  })

  async function onSubmitForm(values: IFormInputs) {
    try {
      if (message) {
        setMessage({
          type: '',
          text: ''
        })
      }

      const responseOptions = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/subscribe`,
        responseOptions
      )
      const data = await response.json()

      console.log('Subscribe data: ', data)

      if (!data.error) {
        setMessage({
          type: 'success',
          text: 'You have successfully subscribed to our newsletter!'
        })

        reset()
      } else {
        setMessage({
          type: 'error',
          text: data.error
        })
      }
    } catch (error) {
      console.log('contact page error', error)
      setMessage({
        type: 'error',
        text: error.message
      })
    }
  }

  return (
    <form className="bg-colorSixteen text-colorFifteen" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="m-auto grid h-full w-[70%] grid-cols-1 gap-8 bg-colorSixteen py-10 text-colorFifteen md:grid-cols-2">
        <div className="max-w-[440px]">
          <h3>Join the Tucker crew</h3>
          <p className="text-base">
            Sign up for latest Tucker Tub products, nutritional advice for your dog and special
            offers.
          </p>
        </div>
        <div className="mt-0 md:mt-12">
          <div className="grid max-w-[440px] grid-cols-[2fr_1fr] grid-rows-1 items-center">
            <div className="relative">
              <EmailIcon className="absolute top-1/2 left-3 -translate-y-1/2" />
              <input
                type="email"
                className="primary-input !rounded-r-none bg-colorFifteen/70 !pl-[2.5rem]"
                placeholder="Email address"
                aria-label="Email address"
                autoComplete="email"
                {...register('email')}
              />
            </div>
            <button
              className="relative right-2 h-[3rem] max-w-[10rem] rounded-lg bg-colorSeven text-base font-bold text-colorFour"
              type="submit"
            >
              {isSubmitting ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
          <p
            className={`p-0 ${
              errors.email?.message || message.type === 'error'
                ? 'text-red-500'
                : 'text-colorFourteen'
            }`}
          >
            {errors.email?.message || message.text}
          </p>
        </div>
      </div>
    </form>
  )
}
