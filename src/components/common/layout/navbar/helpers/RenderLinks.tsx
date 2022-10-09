import type { MouseEvent } from 'react'

import { useGlobalState, useSearch } from '~/context'
import { ActiveLink, MenuLink } from '~/utilities'

export enum LinkType {
  MENU,
  PROFILE,
  NAV_MOBILE,
  NAV_DESKTOP
}

interface ILinkProp {
  id: number
  path: string
  text: string
}

interface IRenderLinksProps {
  linkType: LinkType
  linkFunction: () => ILinkProp[]
}

interface ILinkProps extends Pick<IRenderLinksProps, 'linkType'> {
  data: ILinkProp
}

function RenderLinkType(props: ILinkProps) {
  const { data, linkType } = props
  const { path, text } = data
  const { closeMegaMenu, isMegaMenuOpen } = useGlobalState()
  const { isSearchOpen, handleCloseSearch } = useSearch()

  function handleCloseOnEnterDesktopLink(event: MouseEvent<HTMLAnchorElement>) {
    const target = event.target as HTMLAnchorElement

    if (target.classList.contains('desktop-nav-link') && isMegaMenuOpen) {
      closeMegaMenu()
    }

    if (target.classList.contains('desktop-nav-link') && isSearchOpen) {
      handleCloseSearch()
    }
  }

  if (linkType === LinkType.MENU) {
    return <MenuLink href={path}>{text}</MenuLink>
  }

  if (linkType === LinkType.NAV_DESKTOP) {
    return (
      <ActiveLink
        href={path}
        className="desktop-nav-link"
        closeMegaMenuIfOpen={handleCloseOnEnterDesktopLink}
      >
        {text}
      </ActiveLink>
    )
  }

  if (linkType === LinkType.NAV_MOBILE) {
    return <ActiveLink href={path}>{text}</ActiveLink>
  }

  return null
}

export const RenderLinks = (props: IRenderLinksProps) => {
  const { linkType, linkFunction } = props

  const links = linkFunction().map(link => {
    return (
      <li className="h-inherit" key={link.id}>
        <RenderLinkType data={link} linkType={linkType} />
      </li>
    )
  })

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{links}</>
}
