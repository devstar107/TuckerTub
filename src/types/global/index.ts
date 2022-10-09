import type { AnchorHTMLAttributes, MouseEvent, SVGAttributes } from 'react'

export type IconProps = SVGAttributes<SVGElement>

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  closeMegaMenuIfOpen?: (event: MouseEvent<HTMLAnchorElement>) => void
}
