import type { WrapperProps } from '~/types'

export const TextBold = ({ children, className = '' }: WrapperProps) => {
  return <p className={`w-full font-haboro-soft text-base font-bold ${className}`}>{children}</p>
}
