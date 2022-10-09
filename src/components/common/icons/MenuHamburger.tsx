import { useGlobalState } from '~/context'
import type { IconProps } from '~/types'

export const MenuHamburger = (props: IconProps) => {
  const { className = '' } = props
  const { toggleNav } = useGlobalState()

  return (
    <button type="button" onClick={toggleNav} title="Navigation Menu">
      <svg
        {...props}
        className={`${className} h-6 w-6 cursor-pointer`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
      </svg>
    </button>
  )
}
