import type { WrapperProps } from '~/types'

export const Text = ({ children, className = '' }: WrapperProps) => {
  return <p className={`w-full font-haboro-soft text-base ${className}`}>{children}</p>
}
