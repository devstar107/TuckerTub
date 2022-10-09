/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/button-has-type */
import { CheckIcon } from '@heroicons/react/solid'
import NextLink from 'next/link'

import type { WrapperProps } from '~/types'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth'

type ButtonType = 'button' | 'submit' | 'reset'
interface ButtonWithArrowProps extends WrapperProps {
  href?: string
  center?: boolean
  containerSpanFull?: boolean
  buttonVariant?: ButtonVariant
  buttonType?: ButtonType
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
}

export const ApplyButton = ({
  children,
  href,
  onClick,
  center = false,
  className = '',
  containerSpanFull = false,
  buttonVariant = 'primary',
  buttonType = 'button',
  disabled = false,
  fullWidth = false
}: ButtonWithArrowProps) => {
  const backgroundColor = {
    primary: 'rgba(203, 153, 114, 1)',
    secondary: 'transparent',
    tertiary: 'rgba(255, 247, 240, 1)',
    fourth: 'rgba(1, 64, 50, 1)',
    fifth: 'rgba(178, 169, 174, 1)'
  }

  const color = {
    primary: 'rgba(255, 247, 240, 1)',
    secondary: 'rgba(1, 64, 50, 1)',
    tertiary: 'rgba(1, 64, 50, 1)',
    fourth: 'rgba(255, 247, 240, 1)',
    fifth: 'rgba(255, 247, 240, 1)'
  }

  return (
    <div
      className="w-full"
      style={{
        gridColumn: containerSpanFull ? '1/-1' : 'auto',
        textAlign: center ? 'center' : 'left'
      }}
    >
      {href ? (
        <NextLink href={href} className="w-full py-4 text-left">
          <button
            onClick={onClick}
            type={buttonType}
            disabled={disabled}
            className={`flex items-center justify-between gap-2 rounded-lg py-4 px-6 text-lg font-bold ${className}`}
            // TODO: these styles could reference from var css variables
            style={{
              backgroundColor: backgroundColor[buttonVariant],
              color: color[buttonVariant],
              margin: center ? 'auto' : '0',
              width: fullWidth ? '100%' : 'auto',
              gap: '1rem'
            }}
          >
            {children}
            <CheckIcon width="30px" />
          </button>
        </NextLink>
      ) : (
        <button
          onClick={onClick}
          type={buttonType}
          disabled={disabled}
          className={`flex items-center justify-between gap-2 rounded-lg py-3 px-4 text-lg font-bold ${className}`}
          // TODO: these styles could reference from var css variables
          style={{
            backgroundColor: backgroundColor[buttonVariant],
            color: color[buttonVariant],
            margin: center ? 'auto' : '0',
            width: fullWidth ? '100%' : 'auto',
            gap: '1rem'
          }}
        >
          {children}
          <CheckIcon width="30px" />
        </button>
      )}
    </div>
  )
}

// export const ButtonWithArrowRef = forwardRef<HTMLDivElement, ButtonWithArrowProps>((props, ref) => {
//   return <ButtonWithArrow {...props} ref={ref} />
// })

// ButtonWithArrowRef.displayName = 'ButtonWithArrowRef'
