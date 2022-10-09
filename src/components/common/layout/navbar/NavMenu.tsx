import { useEffect, useState } from 'react'

import { ChevronDownIcon } from '@heroicons/react/solid'
import dynamic from 'next/dynamic'
import NextImage from 'next/future/image'
import NextLink from 'next/link'

import { AccountIcon, SearchIcon, ShoppingBagIcon } from '~/components/common/icons'
import { MenuHamburger } from '~/components/common/icons/MenuHamburger'
import { DesktopLinks } from '~/constants'
import { useCart, useGlobalState, useSearch } from '~/context'
import type { Product } from '~/types'
import { ActiveLink } from '~/utilities'

import { RenderLinks } from './helpers'
import { LinkType } from './helpers/RenderLinks'

const DynamicSearchModal = dynamic(
  async () => {
    const component = await import('./SearchModal')
    return component.SearchModal
  },
  { ssr: false }
)
const DynamicMegaMenuModal = dynamic(
  async () => {
    const component = await import('./MegaMenuModal')
    return component.MegaMenuModal
  },
  { ssr: false }
)

const DynamicMobileMenu = dynamic(
  async () => {
    const component = await import('./MobileMenu')
    return component.MobileMenu
  },
  { ssr: false }
)

const DynamicCart = dynamic(
  async () => {
    const component = await import('~/components/commerce/cart/cart')
    return component.Cart
  },
  { ssr: false }
)

function MobileNavMenu(props: any) {
  // TODO: products and articles are not used
  const { products, articles } = props
  const { cart, openCartModal } = useCart()
  const { isSearchOpen, handleToggleSearch } = useSearch()
  return (
    <div
      className="grid h-navbarHeight w-full grid-cols-2 items-center justify-between px-4 lg:hidden lg:grid-cols-3"
      id="navbar-mobile-container"
    >
      <DynamicMobileMenu />
      <div className="flex h-inherit w-full lg:col-span-2">
        <ActiveLink href="/" className="justify-start">
          <NextImage
            className="h-full w-full max-w-[190px] object-contain pt-2"
            id="logo-desktop-img"
            src="/assets/icons/logo_text.svg"
            alt="Tucker Tub"
            height={190}
            width={40}
          />
        </ActiveLink>
      </div>
      <ul className="m-auto flex w-full items-center justify-end gap-4">
        <li>
          <button type="button" title="Search" className="py-2" onClick={handleToggleSearch}>
            <SearchIcon />
          </button>
        </li>
        <li>
          <button
            type="button"
            title="Cart"
            className="cart-button py-2 text-xl uppercase md:inline-block"
            onClick={openCartModal}
          >
            <div className="relative">
              <ShoppingBagIcon />
              {cart.lineItems?.length > 0 ? (
                <div className="absolute top-[-4px] left-4 flex h-4 w-4 items-center justify-center rounded-full bg-colorTen text-colorFifteen">
                  <span className="text-xs">{cart.lineItems?.length}</span>
                </div>
              ) : null}
            </div>
          </button>
        </li>
        <li>
          <MenuHamburger />
        </li>
      </ul>
    </div>
  )
}

function DesktopNavMenu(props: any) {
  const { products, articles } = props
  const { cart, openCartModal } = useCart()
  const { openMegaMenu, isMegaMenuOpen, closeMegaMenu } = useGlobalState()
  const { isSearchOpen, handleActivateSearch, handleCloseSearch } = useSearch()

  return (
    <div className="grid">
      <div
        id="navbar-desktop-container"
        className="hidden h-navbarHeight items-center px-8 lg:grid lg:grid-cols-[3fr_24fr_1fr] xl:grid-cols-[3fr_20fr_1fr]"
      >
        <ActiveLink href="/">
          <NextImage
            className="h-full w-full max-w-[190px] object-contain pt-2"
            id="logo-desktop-img"
            src="/assets/icons/logo_text.svg"
            alt="Tucker Tub"
            height={190}
            width={40}
          />
        </ActiveLink>
        <div
          id="desktop-nav-ul"
          className="flex h-inherit w-full list-none items-center justify-center space-x-6 text-center text-lg font-bold"
        >
          <li className="h-inherit">
            <NextLink href="/shop" className="h-inherit">
              <button
                type="button"
                className="flex h-inherit w-full items-center py-2 text-colorFourteen transition-colors hover:text-colorSixteen"
                onMouseEnter={() => {
                  if (isSearchOpen) {
                    handleCloseSearch()
                  }

                  openMegaMenu()
                }}
              >
                Shop
                <ChevronDownIcon
                  className={`h-6 w-6 transition ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </NextLink>
          </li>
          <RenderLinks linkType={LinkType.NAV_DESKTOP} linkFunction={DesktopLinks} />
        </div>
        <ul className="flex items-center justify-end gap-x-4">
          <li>
            <button
              type="button"
              className="py-2"
              title="Search"
              onMouseEnter={() => {
                if (isMegaMenuOpen) {
                  closeMegaMenu()
                }

                handleActivateSearch()
              }}
            >
              <SearchIcon />
            </button>
          </li>
          <li>
            <ActiveLink href="/account">
              <AccountIcon />
            </ActiveLink>
          </li>
          <li>
            <button
              type="button"
              className="cart-button hidden py-2 text-xl uppercase md:inline-block"
              onMouseEnter={openCartModal}
            >
              <div className="relative">
                <ShoppingBagIcon />
                {cart.lineItems?.length > 0 ? (
                  <div className="absolute top-[-4px] left-4 flex h-4 w-4 items-center justify-center rounded-full bg-colorTen text-colorFifteen">
                    <span className="text-xs">{cart.lineItems?.length}</span>
                  </div>
                ) : null}
              </div>
            </button>
            <DynamicCart />
          </li>
        </ul>
      </div>
      <div className="hidden lg:block">
        {isSearchOpen && <DynamicSearchModal products={products} articles={articles} />}
        {isMegaMenuOpen && <DynamicMegaMenuModal />}
      </div>
    </div>
  )
}

export const NavMenu = () => {
  const { handleSetSearchLoaded, searchLoaded } = useSearch()
  const [products, setProducts] = useState<Product[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const { abortController } = useCart()
  useEffect(() => {
    // initial fetch on the client for products for search
    handleSetSearchLoaded(false)

    async function fetchProducts() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/products`, {
          method: 'POST',
          signal: abortController?.signal
        })
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.log('fetchProducts error', error)
      }
    }

    async function fetchPosts() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/wp/v2/posts?categories=${process.env.NEXT_PUBLIC_WORDPRESS_CATEGORY_NUTRITION}&status=publish`,
          {
            method: 'GET',
            signal: abortController?.signal
          }
        )
        const data = await response.json()

        const featuredMedia = data.map(post => {
          return post.featured_media
        })

        const featuredMediaResponse = await Promise.all(
          featuredMedia.map(async id => {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT}/wp-json/wp/v2/media/${id}`
            )
            return response.json()
          })
        )

        const filtermediaWithImage = featuredMediaResponse.filter(media => {
          return data
            .map(post => {
              return post.featured_media
            })
            .includes(media.id)
        })

        const combinedData = data.map(post => {
          return {
            ...post,
            featuredMedia:
              filtermediaWithImage.find(media => {
                return media.id === post.featured_media
              })?.source_url ?? ''
          }
        })

        // console.log('SetArticles', searchLoaded)
        setArticles(combinedData)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('fetchPosts AbortError', error)
        }
        console.log('fetchPosts error', error)
      }
    }

    Promise.all([fetchProducts(), fetchPosts()]).then(() => {
      handleSetSearchLoaded(true)
    })
  }, [])

  return (
    <div className="relative">
      <MobileNavMenu products={products} articles={articles} />
      <DesktopNavMenu products={products} articles={articles} />
    </div>
  )
}
