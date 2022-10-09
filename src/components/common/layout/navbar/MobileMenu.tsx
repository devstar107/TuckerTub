/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid'
import NextImage from 'next/future/image'
import NextLink from 'next/link'

import { AccountIcon, ShoppingBagIcon } from '~/components/common/icons'
import { DesktopLinks } from '~/constants'
import { useCart, useGlobalState } from '~/context'
import { ActiveLink } from '~/utilities'

import { NavLinksMap } from '../footer/nav-links-map'
import { RenderLinks } from './helpers'
import { LinkType } from './helpers/RenderLinks'
import { MegaMenu } from './MegaMenu'
import { MobileMegaMenu } from './MobileMegaMenu'

// import { LogoIcon, PlusIcon } from '~/icons'

export const MobileMenu = () => {
  const { navbarOpen, closeNavbarModal, isMobileMenuOpen, toggleMobileMenu } = useGlobalState()
  const { cart } = useCart()
  return (
    <Transition.Root show={navbarOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[100]" onClose={closeNavbarModal}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="absolute inset-0 bg-gray-500/70 transition-opacity"
              onMouseOver={closeNavbarModal}
            />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 flex w-[380px] max-w-full">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="flex h-full w-screen max-w-[800px] flex-col bg-colorFifteen px-7 text-colorFourteen shadow-xl">
                <div className="mt-20 flex items-center justify-between">
                  <ActiveLink href="/" className="justify-left outline-none">
                    <NextImage
                      className="h-full w-full max-w-[150px] object-contain pt-2"
                      id="logo-desktop-img"
                      src="/assets/icons/logo_text.svg"
                      alt="Tucker Tub"
                      height={190}
                      width={40}
                    />
                  </ActiveLink>
                  <div className="flex items-center space-x-2">
                    <NextLink href="/cart">
                      <div className="relative">
                        <ShoppingBagIcon />
                        {cart.lineItems.length > 0 ? (
                          <div className="absolute top-[-4px] left-4 flex h-4 w-4 items-center justify-center rounded-full bg-colorTen text-colorFifteen">
                            <span className="text-xs">{cart.lineItems.length}</span>
                          </div>
                        ) : null}
                      </div>
                    </NextLink>
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => {
                          return closeNavbarModal()
                        }}
                      >
                        <span className="sr-only">Close cart</span>
                        <PlusIcon className="h-10 w-10 rotate-45" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
                <div id="desktop-nav-ul" className="grid list-none text-center text-lg font-bold">
                  <li className="h-inherit">
                    <button
                      type="button"
                      className="flex h-inherit w-full items-center py-2 text-colorFourteen transition-colors hover:text-colorSixteen"
                      onClick={() => {
                        console.log('isMegaMenu open', isMobileMenuOpen)
                        toggleMobileMenu()
                      }}
                    >
                      Shop
                      <ChevronDownIcon className="h-6 w-6" />
                    </button>
                    {isMobileMenuOpen && <MobileMegaMenu />}
                  </li>
                  <RenderLinks linkType={LinkType.NAV_MOBILE} linkFunction={DesktopLinks} />
                </div>
                <hr className="border-2 border-colorFourteen" />
                <ActiveLink href="/account" className="my-2 flex h-fit gap-4">
                  <AccountIcon />
                  <div className="item-bottom flex justify-start font-bold text-colorFourteen">
                    My Account
                  </div>
                </ActiveLink>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
