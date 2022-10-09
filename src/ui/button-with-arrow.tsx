/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/button-has-type */
import type { CSSProperties } from 'react'

import { ArrowRightIcon } from '@heroicons/react/solid'
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
  buttonStyles?: CSSProperties
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
}

export const ButtonWithArrow = ({
  children,
  href,
  onClick,
  center = false,
  className = '',
  containerSpanFull = false,
  buttonVariant = 'primary',
  buttonType = 'button',
  buttonStyles = {},
  disabled = false,
  fullWidth = false
}: ButtonWithArrowProps) => {
  const backgroundColor = {
    primary: 'rgba(203, 153, 114, 1)',
    secondary: 'transparent',
    tertiary: 'rgba(255, 247, 240, 1)',
    fourth: 'rgba(1, 64, 50, 1)',
    fifth: 'rgba(134, 203,146, 1)'
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
            className={`flex items-center justify-between gap-2 rounded-lg py-3 px-5 text-lg font-bold transition duration-300 ease-in-out hover:shadow-ecPrimary-4 ${className}`}
            // TODO: these styles could reference from var css variables
            style={{
              backgroundColor: backgroundColor[buttonVariant],
              color: color[buttonVariant],
              margin: center ? 'auto' : '0',
              ...buttonStyles
              // width: fullWidth ? '323px' : '240px'
            }}
          >
            {children}
            <ArrowRightIcon width="25px" />
          </button>
        </NextLink>
      ) : (
        <button
          onClick={onClick}
          type={buttonType}
          disabled={disabled}
          className={`flex items-center justify-between gap-2 rounded-lg py-3 px-5 text-lg font-bold transition duration-300 ease-in-out hover:shadow-ecPrimary-4 ${className}`}
          // TODO: these styles could reference from var css variables
          style={{
            backgroundColor: backgroundColor[buttonVariant],
            color: color[buttonVariant],
            margin: center ? 'auto' : '0',
            width: '100%',
            maxWidth: fullWidth ? '100%' : '240px',
            ...buttonStyles
          }}
        >
          {children}
          <ArrowRightIcon width="25px" />
        </button>
      )}
    </div>
  )
}

// export const ButtonWithArrowRef = forwardRef<HTMLDivElement, ButtonWithArrowProps>((props, ref) => {
//   return <ButtonWithArrow {...props} ref={ref} />
// })

// ButtonWithArrowRef.displayName = 'ButtonWithArrowRef'
