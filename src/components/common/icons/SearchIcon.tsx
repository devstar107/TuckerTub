import type { IconProps } from '~/types'

export const SearchIcon = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
    >
      <path
        fill="none"
        stroke="#014032"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        d="M8.86125909,17.7225182 C13.7551973,17.7225182 17.7225182,13.7551973 17.7225182,8.86125909 C17.7225182,3.96732083 13.7551973,0 8.86125909,0 C3.96732083,0 0,3.96732083 0,8.86125909 C0,13.7551973 3.96732083,17.7225182 8.86125909,17.7225182 Z M15.1265841,15.1264867 L21.9991197,22"
        transform="translate(2 2)"
      />
    </svg>
  )
}
