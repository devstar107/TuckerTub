import type { WrapperProps } from '~/types'

export const Title = ({ children, className = '' }: WrapperProps) => {
  return <p className={`text-list font-bold lg:text-title ${className}`}>{children}</p>
}
