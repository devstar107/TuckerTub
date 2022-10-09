import type { HTMLAttributes } from 'react'

import NextLink from 'next/link'

import { CustomerServiceLinks } from '~/constants'

export const CustomerServiceMap = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className } = props
  return (
    <div className={className}>
      <ul>
        <li className="grid text-base leading-8">
          {CustomerServiceLinks.map(link => {
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
