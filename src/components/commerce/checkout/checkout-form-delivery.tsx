/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import NextLink from 'next/link'
import type { FieldErrors, UseFormRegisterReturn } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { useAuth, useCart, useOrder } from '~/context'
import { ButtonWithArrow } from '~/ui'
import { formatMoney, updateWooOrder } from '~/utilities'
import type { CheckoutFormDeliveryInput } from '~/validation/checkout-form-delivery.schema'
import { checkoutFormDeliverySchema } from '~/validation/checkout-form-delivery.schema'

export const CheckoutFormDelivery = () => {
  const { order, setOrder, setCheckoutView, shippingMethod, orderEmail } = useOrder()
  const { cart } = useCart()
  const { user } = useAuth()
  const { abortController, setCheckoutStep } = useCart()
  const [checkoutErrorMessage, setCheckoutErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormDeliveryInput>({
    resolver: zodResolver(checkoutFormDeliverySchema),
    mode: 'all'
  })

  const shippingMethodFields = {
    ...register('shippingMethod')
  }

  // 5 days from now on
  const deliveryExpectedStandard = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)

  // 3 days from now on
  const deliveryExpectedExpress = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  // TODO: With this logic the user can't choose any shipping methods, it will simply choose the one available and set that as the state. The value from the input fields are just a simple boolean which is not helpful in terms of knowing what input is what.

  const activeShippingMethod =
    order.shippingOptions.shippingMethods.find(shippingMethod => {
      return shippingMethod.freeShipping && cart?.subtotal >= shippingMethod.minAmount.amount
    }) ??
    order.shippingOptions.shippingMethods.find(shippingMethod => {
      return shippingMethod.flatRate
    })

  // causes infinite loop
  // setShippingMethod(activeShippingMethod)

  async function onSubmitForm() {
    try {
      console.log('UpdateShippingSHippingMethod', shippingMethod)

      if (checkoutErrorMessage) {
        setCheckoutErrorMessage('')
      }

      await updateWooOrder({
        selectedShippingMethod: activeShippingMethod,
        abortController,
        userEmail: user?.email ?? orderEmail,
        setOrder
      })

      setCheckoutStep(4)
      setCheckoutView({
        isEmailView: false,
        isOrderAddressView: false,
        isDeliveryView: false,
        isPayView: true,
        isConfirmedThankYouView: false,
        isIncompatibleShippingView: false
      })
    } catch (error) {
      console.log('checkoutFormDelivery error: ', error)
      setCheckoutErrorMessage('Something went wrong.')
    }
  }

  console.log('CheckoutFormDelivery shippingPostCode', order)

  return (
    <section className="max-w-[440px] gap-20 space-y-4">
      <form onSubmit={handleSubmit(onSubmitForm)} className=" space-y-3">
        <p className="pb-2 text-lg font-bold text-colorFourteen">
          Which delivery service would you like?
        </p>
        <RenderShippingMethods
          shippingMethodFields={shippingMethodFields}
          errors={errors}
          activeShippingMethod={activeShippingMethod}
        />
        {/* TODO: Commented this now because we dont get any reliable data from any API */}
        {/* <p className="py-8 text-base font-bold text-colorTen">
          Delivery expected by{' '}
          <span>
            {deliveryExpectedStandard.toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </p> */}
        <div className="text-colorFourteen">
          <h4 className="pt-0 pb-3">Delivery Details</h4>
          <p>
            {order.shipping.first_name} {order.shipping.last_name}
          </p>
          {order.shipping.phone && <p>{order.shipping.phone}</p>}
          <p>{order.shipping.address_1}</p>
          <p>{order.shipping.address_2}</p>
          <p>{order.shipping.city}</p>
          <p>{order.shipping.state}</p>
          <p>{order.shipping.postcode}</p>
          <p>{order.shipping.country}</p>
        </div>
        <div className="py-4">
          <ButtonWithArrow
            fullWidth
            buttonType="submit"
            buttonVariant="fourth"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Continuing...' : 'Continue to Payment'}
          </ButtonWithArrow>
        </div>
        {checkoutErrorMessage && (
          <div>
            <p className="p-0 text-colorThirteen">{checkoutErrorMessage}</p>
          </div>
        )}
        <div className="space-y-4 py-5">
          <p>
            More information on{' '}
            <NextLink href="/policies/shipping-and-delivery" className="underline">
              Shipping & Delivery
            </NextLink>
          </p>
        </div>
      </form>
    </section>
  )
}

interface RenderShippingMethodsProps {
  shippingMethodFields: UseFormRegisterReturn
  activeShippingMethod: any
  errors: FieldErrors<{
    shippingMethod: boolean
  }>
}

function RenderShippingMethods(props: RenderShippingMethodsProps) {
  const { shippingMethodFields, errors, activeShippingMethod } = props
  const { cart } = useCart()
  const { order, setShippingMethod } = useOrder()

  useEffect(() => {
    setShippingMethod(activeShippingMethod)
  }, [activeShippingMethod, setShippingMethod])

  const refrigeratedItems = cart.lineItems.filter(item => {
    return item.shipping_class === 'refrigerated'
  })

  console.log('order.shipping_lines?.[0].total', order)

  console.log('activeShippingMethod122', activeShippingMethod)
  console.log('RenderShippingMethods_refrigeratedItems', refrigeratedItems)

  if (refrigeratedItems.length > 0) {
    return (
      <div>
        <div className="flex items-center justify-between rounded-lg bg-white py-4 px-5">
          <label
            htmlFor={activeShippingMethod.inputLabel}
            className="inline-flex items-center text-lg font-semibold"
          >
            <input
              id={activeShippingMethod.inputLabel}
              type="checkbox"
              defaultChecked
              className="mr-3 h-6 w-6 rounded-full border-colorFourteen text-colorTen outline-none focus:ring-transparent"
              name={shippingMethodFields.name}
              ref={shippingMethodFields.ref}
              onBlur={shippingMethodFields.onBlur}
              onChange={event => {
                shippingMethodFields.onChange(event)
                setShippingMethod(activeShippingMethod)
              }}
            />
            {activeShippingMethod.title}
          </label>
          <div className="text-md">
            {activeShippingMethod.methodId === 'flat_rate' ? (
              <p>{formatMoney(activeShippingMethod.total.value)}</p>
            ) : (
              <p>FREE</p>
            )}
          </div>
        </div>
        <p className="p-0 text-colorThirteen">{errors.shippingMethod?.message}</p>
      </div>
    )
  }

  return (
    <RenderNoClassShippedAnywhere
      shippingMethodFields={shippingMethodFields}
      errors={errors}
      activeShippingMethod={activeShippingMethod}
    />
  )
}

interface RenderNoClassShippedAnywhereProps {
  shippingMethodFields: UseFormRegisterReturn
  errors: FieldErrors<{
    shippingMethod: boolean
  }>
  activeShippingMethod: boolean
}

function RenderNoClassShippedAnywhere(props: RenderNoClassShippedAnywhereProps) {
  const { shippingMethodFields, errors, activeShippingMethod } = props
  const { setShippingMethod } = useOrder()
  console.log('activeShippingMethodactiveShippingMethod', activeShippingMethod)

  useEffect(() => {
    setShippingMethod(activeShippingMethod)
  }, [activeShippingMethod, setShippingMethod])

  return (
    <div>
      <div
        key={activeShippingMethod.id}
        className="flex items-center justify-between rounded-lg bg-white py-4 px-5"
      >
        <label
          htmlFor={activeShippingMethod.inputLabel}
          className="inline-flex items-center text-lg font-semibold"
        >
          <input
            id={activeShippingMethod.inputLabel}
            type="checkbox"
            defaultChecked
            className="mr-3 h-6 w-6 rounded-full border-colorFourteen text-colorTen outline-none focus:ring-transparent"
            name={shippingMethodFields.name}
            ref={shippingMethodFields.ref}
            onBlur={shippingMethodFields.onBlur}
            onChange={event => {
              shippingMethodFields.onChange(event)
              setShippingMethod(activeShippingMethod)
            }}
          />
          {activeShippingMethod.title}
        </label>
        <div className="text-md">
          {activeShippingMethod.freeShipping
            ? 'FREE'
            : formatMoney(activeShippingMethod.cost ?? activeShippingMethod.total?.value)}
        </div>
      </div>
      <div>
        <p className="p-0 text-colorThirteen">{errors.shippingMethod?.message}</p>
      </div>
    </div>
  )

  // TODO: This code could be useful later if more shipping options than one. Otherwise, we are currently just showing either free or non free shipping methods right now.

  // return (
  //   <>
  //     {order.shippingOptions.shippingMethods.map(shippingOption => {
  //       return (
  //         <div
  //           key={shippingOption.id}
  //           className="flex items-center justify-between rounded-lg bg-white py-4 px-5"
  //         >
  //           <label
  //             htmlFor={shippingOption.inputLabel}
  //             className="inline-flex items-center text-lg font-semibold"
  //           >
  //             <input
  //               id={shippingOption.inputLabel}
  //               type="checkbox"
  //               className="mr-3 h-6 w-6 rounded-full border-colorFourteen text-colorTen outline-none focus:ring-transparent"
  //               name={shippingMethodFields.name}
  //               ref={shippingMethodFields.ref}
  //               onBlur={shippingMethodFields.onBlur}
  //               onChange={event => {
  //                 shippingMethodFields.onChange(event)
  //                 setShippingMethod(shippingOption)
  //               }}
  //             />
  //             {shippingOption.title}
  //           </label>
  //           <div className="text-md">
  //             {shippingOption.freeShipping ? 'FREE' : formatMoney(shippingOption.cost)}
  //           </div>
  //         </div>
  //       )
  //     })}
  //     <div>
  //       <p className="p-0 text-colorThirteen">{errors.shippingMethod?.message}</p>
  //     </div>
  //   </>
  // )
}
