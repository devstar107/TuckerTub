import type { IconProps } from '~/types'

export const Curve = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
    >
      <path
        fill="#0099ff"
        fillOpacity="1"
        d="M0,256L120,256C240,256,480,256,720,218.7C960,181,1200,107,1320,69.3L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
      />
    </svg>
  )
}
