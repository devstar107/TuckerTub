import type { WrapperProps } from '~/types'

export const HeroText = ({ children, className = '' }: WrapperProps) => {
  return <div className={`w-full text-base lg:w-3/5 ${className}`}>{children}</div>
}
