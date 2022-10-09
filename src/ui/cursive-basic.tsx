import type { WrapperProps } from '~/types'

export const CursiveBasic = ({ children, className = '' }: WrapperProps) => {
  return (
    <div
      className={`m-auto font-madelyn text-sliderTitle text-colorSixteen lg:text-blockHeader ${className}`}
    >
      {children}
    </div>
  )
}
