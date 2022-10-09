import type { WrapperProps } from '~/types'

export const ImageWrapper = ({ children, className = '' }: WrapperProps) => {
  return (
    <div className={`relative aspect-1 rounded-xl shadow-ecPrimary-4 ${className}`}>{children}</div>
  )
}
