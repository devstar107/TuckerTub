import type { WrapperProps } from '~/types'

export const Cursive = ({ children, className = '' }: WrapperProps) => {
  return (
    <div
      className={`m-auto font-madelyn text-sliderTitle text-colorSixteen lg:text-bigHeader ${className}`}
    >
      {children}
    </div>
  )
}
