import type { MouseEvent } from 'react'

import { useRouter } from 'next/router'

import type { LinkProps } from '~/types'

export function ActiveLink(props: LinkProps) {
  const { className = '', children, href, closeMegaMenuIfOpen } = props
  const router = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    router.push(href)
  }

  return (
    <a
      className={`flex h-inherit w-full items-center py-2 underline-offset-4 transition-colors hover:text-colorSixteen ${className} ${
        router.pathname.includes(href) ? 'text-colorTen' : 'text-colorFourteen'
      }`}
      href={href}
      onClick={handleClick}
      onMouseEnter={closeMegaMenuIfOpen}
    >
      {children}
    </a>
  )
}
