import type { WrapperProps } from '~/types'

export const Wrapper = ({ children, className = '' }: WrapperProps) => {
  return (
    <div className={`${className.length ? className : 'm-auto w-[90%] lg:w-[80%] '}`}>
      {children}
    </div>
  )
}
