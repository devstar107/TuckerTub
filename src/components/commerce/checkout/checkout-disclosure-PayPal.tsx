import { useEffect, useState } from 'react'

import { PayPalConfirmIcon } from '~/components/common/icons/PayPalConfirmIcon'
import { PayPalIcon } from '~/components/common/icons/PayPalIcon'
import { useOrder } from '~/context'
import { formatMoney } from '~/utilities'

import PaypalButton from '../paypal/paypal-button'
import { PaymentGateway } from './checkout-view/pay-view'

interface PaypalDisclosureProps {
  paymentGateway: PaymentGateway
  // cardPayReady: boolean
  handleChoosePaymentMethod: (paymentMethod: PaymentGateway.PAYPAL) => void
}

export const PaypalDisclosure = (props: PaypalDisclosureProps) => {
  const { paymentGateway, handleChoosePaymentMethod } = props
  const [checked, setChecked] = useState(false)
  const { order } = useOrder()

  function handlePaymentSelection() {
    handleChoosePaymentMethod(PaymentGateway.PAYPAL)
  }

  useEffect(() => {
    if (paymentGateway === PaymentGateway.PAYPAL) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [paymentGateway])

  return (
    <div
      className="mx-auto w-full cursor-pointer rounded-lg bg-white p-5"
      onClick={handlePaymentSelection}
    >
      <button
        className="flex w-full justify-between rounded-lg text-left text-lg font-semibold text-colorFourteen focus:outline-2 focus-visible:ring"
        type="button"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              className="h-5 w-5 cursor-pointer rounded-full border-colorFourteen text-colorTen focus:ring-transparent"
              id="stripe-card"
              checked={checked}
              readOnly
            />
            <label className="cursor-pointer select-none pl-3 text-lg">PayPal</label>
          </div>
          <div className="flex gap-2 overflow-hidden">
            <PayPalIcon />
          </div>
        </div>
      </button>

      <div
        className={`accordion-content overflow-hidden ${
          paymentGateway === PaymentGateway.PAYPAL && 1 + 1 === 2 ? 'h-auto' : 'h-0'
        }`}
      >
        <div
          className={`text-sm text-colorSeven ${
            paymentGateway === PaymentGateway.PAYPAL && 1 + 1 === 2 ? 'px-4 pt-4 pb-2' : 'p-0'
          }
          `}
        >
          <p>Check out securely with PayPal</p>
          <p>or</p>
          <p>Pay in 4 interest-free payments of {formatMoney(order.total / 4)}</p>
          <div className="flex justify-between space-x-2 py-2">
            <span>
              <PayPalConfirmIcon />
            </span>
            <p className="text-sm">
              After submitting your order, you will be redirected to securely complete your
              purchase.
            </p>
          </div>
          {paymentGateway === PaymentGateway.PAYPAL && 1 + 1 === 2 && (
            <PaypalButton fundingSource="paypal" />
          )}
        </div>
      </div>
    </div>
  )
}
