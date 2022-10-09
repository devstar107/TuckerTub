import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import type {
  StripeCardCvcElementOptions,
  StripeCardElementOptions,
  StripeCardExpiryElementOptions,
  StripeCardNumberElementOptions
} from '@stripe/stripe-js'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO } from '~/constants'

const CARD_NUMBER_ELEMENT_OPTIONS: StripeCardNumberElementOptions = {
  placeholder: 'Card Number',
  showIcon: true,
  iconStyle: 'solid',
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'haboro-soft, sans-serif',
      '::placeholder': {
        color: 'black'
      }
    },
    invalid: {
      color: '#9e2146'
    }
  }
}

const CARD_ELEMENT_OPTIONS:
  | StripeCardElementOptions
  | StripeCardExpiryElementOptions
  | StripeCardCvcElementOptions
  | StripeCardNumberElementOptions = {
  style: {
    base: {
      iconColor: 'black',
      color: 'black',
      fontSize: '18px',
      fontFamily: 'haboro-soft, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: 'black'
      }
    },
    invalid: {
      iconColor: '#fa004f',
      color: '#fa004f'
    }
  }
}
export const CardPayment = () => {
  const customerInfo = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO)
  const parsedCustomerInfo = JSON.parse(customerInfo || '{}') ?? {}

  console.log('ORDERADDRESSVIEW-parsedCustomerInfo', parsedCustomerInfo)

  const preloadedValues = {
    firstName: parsedCustomerInfo?.first_name ?? '',
    lastName: parsedCustomerInfo?.last_name ?? ''
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[4fr_2fr_1fr] gap-x-2 rounded-lg border border-solid border-colorFive bg-white p-3 lg:grid-cols-[6fr_2fr_1fr]">
        <CardNumberElement options={CARD_NUMBER_ELEMENT_OPTIONS} />
        <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
        <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {/* TODO: this name and billing address is prob not used, send with form? */}
      <input
        type="text"
        placeholder="Name on Card*"
        autoComplete="name"
        className="w-full rounded-lg border border-solid border-colorFive p-3 placeholder:text-colorFourteen"
        defaultValue={`${preloadedValues.firstName} ${preloadedValues.lastName}`}
      />
      <label
        htmlFor="billing-address-same-as-delivery-checkbox"
        className="inline-flex items-center text-base"
      >
        <input
          type="checkbox"
          className="mr-2 h-4 w-4 rounded-full border-colorFourteen text-colorTen outline-none focus:ring-transparent"
          id="billing-address-same-as-delivery-checkbox"
          name="checkbox"
          defaultChecked
          value="billing-address"
        />
        Billing Address same as Delivery
      </label>
    </div>
  )
}
