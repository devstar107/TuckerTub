import type { HTMLAttributes } from 'react'

import NextImage from 'next/future/image'

export const PaymentsFooter = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className } = props
  return (
    <div className={className}>
      <p className="py-4 text-base">Online Payment Accepted</p>
      <div className="flex flex-wrap gap-2">
        <NextImage src="/assets/payments-logo/visa.svg" alt="Visa" height={24} width={32} />
        <NextImage
          src="/assets/payments-logo/mastercard.svg"
          alt="Mastercard"
          height={24}
          width={32}
        />
        <NextImage src="/assets/payments-logo/amex.svg" alt="Amex" height={24} width={32} />
        <NextImage
          src="/assets/payments-logo/applepay.svg"
          alt="Apple Pay"
          height={24}
          width={32}
        />
        <NextImage
          src="/assets/payments-logo/googlepay.svg"
          alt="Google Pay"
          height={24}
          width={32}
        />
        <NextImage src="/assets/payments-logo/paypal.svg" alt="Paypal" height={24} width={32} />
        {/* TODO: Commented for now */}
        {/* <NextImage src="/assets/payments-logo/afterpay.svg" alt="Afterpay" height={24} width={32} /> */}
      </div>
    </div>
  )
}
