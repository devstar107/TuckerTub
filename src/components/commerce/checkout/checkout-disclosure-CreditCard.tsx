import { useCallback, useEffect, useState } from 'react'

import { AmexIcon } from '~/components/common/icons/AmexIcon'
import { MasterCardIcon } from '~/components/common/icons/MasterCardIcon'
import { VisaIcon } from '~/components/common/icons/VisaIcon'

import { CardPayment } from '../stripe/card-payment'
import { PaymentGateway } from './checkout-view/pay-view'

interface CreditCardDisclosureProps {
  paymentGateway: PaymentGateway
  cardPayReady: boolean
  handleChoosePaymentMethod: (paymentMethod: PaymentGateway.CARD) => void
}

export const CreditCardDisclosure = (props: CreditCardDisclosureProps) => {
  const { paymentGateway, cardPayReady, handleChoosePaymentMethod } = props
  const [checked, setChecked] = useState(false)

  const handlePaymentSelection = useCallback(() => {
    handleChoosePaymentMethod(PaymentGateway.CARD)
  }, [handleChoosePaymentMethod])

  useEffect(() => {
    if (paymentGateway === PaymentGateway.CARD) {
      handlePaymentSelection()
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [paymentGateway, cardPayReady, handlePaymentSelection])

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
            <label className="cursor-pointer select-none pl-3 text-lg">Credit Card</label>
          </div>
          <div className="flex gap-2 overflow-hidden">
            <VisaIcon />
            <MasterCardIcon />
            <AmexIcon />
          </div>
        </div>
      </button>

      <div
        className={`accordion-content overflow-hidden ${
          paymentGateway === PaymentGateway.CARD && cardPayReady ? 'h-auto' : 'h-0'
        }`}
      >
        <div
          className={`text-sm text-gray-500 ${
            paymentGateway === PaymentGateway.CARD && cardPayReady ? 'pt-4 pb-2' : 'p-0'
          }
          `}
        >
          {paymentGateway === PaymentGateway.CARD && cardPayReady && <CardPayment />}
        </div>
      </div>
    </div>
  )
}
