import type { HTMLAttributes } from 'react'

import NextImage from 'next/future/image'

export const LogoFooter = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className } = props
  return (
    <div className={`${className} grid grid-cols-[3fr_10fr] gap-6 lg:grid-cols-1`}>
      <div>
        <NextImage src="/assets/icons/TT-logo.svg" alt="Tucker Tub" width={72} height={70} />
      </div>
      <div>
        <p className="py-0 pr-6 text-base">
          Tucker Tub is all natural dog food, made farm fresh in Australia using locally sourced
          ingredients. Our nutrient-rich recipes are vet and pet nutritionist approved. We deliver
          straight to your door in Victoria, Australia, making it easy for your dog to eat and live
          healthy.
        </p>
      </div>
    </div>
  )
}
