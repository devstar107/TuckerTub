import type { IconProps } from '~/types'

export const CheckoutChevronIcon = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="26"
      viewBox="0 0 15 26"
    >
      <path
        fill="none"
        stroke="#014032"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M16.3483243,16.3483243 L5.86654655,5.86654655 C5.72897759,5.72917338 5.65167567,5.54273783 5.65167567,5.34832433 C5.65167567,5.15391083 5.72897759,4.96747528 5.86654655,4.83010211 L16.3483243,-5.65167567"
        transform="matrix(1 0 0 -1 -3.652 18.78)"
      />
    </svg>
  )
}
