import type { WrapperProps } from '~/types'

export const TeamText = ({ children, className = '' }: WrapperProps) => {
  return <p className={`w-full py-3 font-haboro-soft text-base ${className}`}>{children}</p>
}
