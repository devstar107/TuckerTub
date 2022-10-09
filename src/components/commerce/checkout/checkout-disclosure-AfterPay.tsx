import { useEffect, useState } from 'react'

import { AfterpayIcon } from '~/components/common/icons/AfterpayIcon'

import { PaymentGateway } from './checkout-view/pay-view'

interface AfterpayDisclosureProps {
  handleChoosePaymentMethod: (paymentMethod: PaymentGateway.AFTERPAY_CLEARPAY) => void
  paymentGateway: PaymentGateway
  afterPayReady: boolean
}

export const AfterPayDisclosure = (props: AfterpayDisclosureProps) => {
  const { handleChoosePaymentMethod, paymentGateway, afterPayReady } = props
  const [checked, setChecked] = useState(false)

  function handlePaymentSelection() {
    handleChoosePaymentMethod(PaymentGateway.AFTERPAY_CLEARPAY)
  }

  useEffect(() => {
    if (paymentGateway === PaymentGateway.AFTERPAY_CLEARPAY && afterPayReady) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [paymentGateway, afterPayReady])

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
              id="afterpay-payment"
              checked={checked}
              readOnly
            />
            <label htmlFor="afterpay-payment" className="cursor-pointer select-none pl-3 text-lg">
              Afterpay
            </label>
          </div>
          <div className="flex gap-2 overflow-hidden">
            <AfterpayIcon />
          </div>
        </div>
      </button>
    </div>
  )
}
