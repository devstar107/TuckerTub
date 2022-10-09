import type { HTMLAttributes } from 'react'

import NextLink from 'next/link'

import { FooterLinks } from '~/constants'

// TODO: this is essentially the same component as customer-service-map, fix
export const NavLinksMap = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className } = props
  return (
    <div className={className}>
      <ul>
        <li className="grid text-base leading-8">
          {FooterLinks.map(link => {
            return (
              <NextLink key={link.id} href={link.path}>
                {link.text}
              </NextLink>
            )
          })}
        </li>
      </ul>
    </div>
  )
}
