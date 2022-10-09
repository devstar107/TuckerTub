import type { WrapperProps } from '~/types'

export const BackgroundWrap = ({ children, style, className = '' }: WrapperProps) => {
  return (
    <div className={`desktop h-full w-full bg-cover bg-no-repeat  ${className}`} style={style}>
      {children}
    </div>
  )
}
