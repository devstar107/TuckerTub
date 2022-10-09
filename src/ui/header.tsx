import type { WrapperProps } from '~/types'

export const Header = ({ children, className = '' }: WrapperProps) => {
  return (
    <h2
      className={`m-auto w-[80%] font-tucker-tub text-4xl font-bold uppercase lg:text-header ${className}`}
    >
      {children}
    </h2>
  )
}
