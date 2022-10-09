import NextLink from 'next/link'
import { useRouter } from 'next/router'

interface BreadcrumbsProps {
  isAbsolute?: boolean
}

export const Breadcrumbs = ({ isAbsolute = false }: BreadcrumbsProps) => {
  const router = useRouter()
  const { asPath } = router

  const paths = asPath.split('/')

  const breadcrumbPaths = paths.map((item, index) => {
    if (item === '') {
      return {
        name: 'Home',
        href: '/'
      }
    }

    const name = item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' ')

    // capitalizes the first letter in every word
    const nameWithCapitalizedLetterAfterSpace = name.replace(/\s(.)/g, $1 => {
      return $1.toUpperCase()
    })

    const href = `${paths.slice(0, index + 1).join('/')}`

    return {
      name: nameWithCapitalizedLetterAfterSpace,
      href
    }
  })

  const defaultColors = {
    isActiveColor: 'text-colorTen',
    normalColor: 'text-colorFive'
  }

  const absoluteColors = {
    normalColor: 'text-colorFifteen',
    isActiveColor: 'text-colorTwelve'
  }

  const activeColors = isAbsolute ? absoluteColors : defaultColors

  const breadcrumbItems = breadcrumbPaths.map((crumb, index) => {
    const isCurrentCrumb = crumb.href === router.asPath
    const isLastCrumb = index === breadcrumbPaths.length - 1

    return (
      <div key={crumb.href} className="inline-block">
        <NextLink
          href={crumb.href}
          className={`${isCurrentCrumb ? activeColors.isActiveColor : activeColors.normalColor} ${
            isLastCrumb ? 'pointer-events-none' : ''
          } text-base`}
        >
          {crumb.name}
        </NextLink>
        {!isLastCrumb && (
          <span
            className={`${
              isCurrentCrumb ? activeColors.isActiveColor : activeColors.normalColor
            } text-base`}
          >
            &nbsp;&gt;&nbsp;
          </span>
        )}
      </div>
    )
  })

  return <div className={`z-10 py-8 ${isAbsolute ? 'absolute' : 'static'}`}>{breadcrumbItems}</div>
}
