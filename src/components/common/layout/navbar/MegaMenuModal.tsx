import { Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'
import NextLink from 'next/link'

import { megaMenuItems } from '~/constants/mega-menu'
import { useGlobalState } from '~/context'
import { ButtonWithArrow } from '~/ui'

import { MegaMenuItem } from './MegaMenu'

export const MegaMenuModal = () => {
  const { isMegaMenuOpen, closeMegaMenu } = useGlobalState()

  return (
    <Transition.Root show={isMegaMenuOpen} as={Fragment}>
      <Dialog as="div" className="inset-0 z-[100]" onClose={closeMegaMenu}>
        <div className="absolute inset-0 z-10 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out transition duration-800"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="fixed inset-0 top-0 -z-50 bg-gray-500/70 transition-opacity"
              onMouseOver={closeMegaMenu}
            />
          </Transition.Child>

          <div className="fixed inset-x-0 top-[calc(var(--navbar-height)_+_var(--announcement-bar-height))] flex max-w-full bg-colorFifteen">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-800"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <section className="flex w-full items-center justify-center pt-8">
                <div>
                  <div className="m-auto grid max-w-[900px] grid-cols-2 place-items-center gap-x-14 text-center sm:grid-cols-4 lg:grid-cols-4 lg:gap-x-24">
                    {megaMenuItems.map(item => {
                      return (
                        <NextLink
                          key={item.id}
                          href={`/shop/${item.slug}`}
                          className="mega-menu-link"
                        >
                          <MegaMenuItem key={item.id} megaMenuData={item} />
                        </NextLink>
                      )
                    })}
                  </div>
                  <div className="py-8">
                    <ButtonWithArrow
                      buttonVariant="secondary"
                      containerSpanFull
                      center
                      href="/shop"
                    >
                      Shop All Products
                    </ButtonWithArrow>
                  </div>
                </div>
              </section>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
