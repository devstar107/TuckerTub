import type { WrapperProps } from '~/types'

export const GradientWrap = ({ children, className = '' }: WrapperProps) => {
  return <div className={`h-full w-full bg-gradient-to-r ${className}`}>{children}</div>
}

// put gradient path: from-colorxxx via-colorxxx to-xxx
// color with opacity: from-colorxxx/number e.g. from-colorxxx/0.5
// colorxxx/0.8  and colorxxx/80 are different
