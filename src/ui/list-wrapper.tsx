import type { WrapperProps } from '~/types'

export const ListWrapper = ({ children, className = '' }: WrapperProps) => {
  return (
    <div
      className={`h-full w-full flex gap-x-4 ${className}`}
    >
      {children}
    </div>
  )
}
