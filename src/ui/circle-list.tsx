import type { WrapperProps } from '~/types'

export const CircleList = ({ children, className = '' }: WrapperProps) => {
  return (
    <div
      className={`h-8 w-8 rounded-full ${className}`}
    >
      {children}
    </div>
  )
}
