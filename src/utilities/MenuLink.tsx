import type { MouseEvent } from 'react'

import { useRouter } from 'next/router'

import type { LinkProps } from '~/types'

export function MenuLink(props: LinkProps) {
  const { className = '', children, href } = props
  const router = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()

    router.push(href)
  }

  return (
    <a
      className={`transition-colors hover:text-colorSixteen ${className} ${
        router.pathname === href ? 'font-bold underline' : ''
      }`}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
