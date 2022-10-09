import { Fragment } from 'react'

import { Dialog, Transition } from '@headlessui/react'

import { useSearch } from '~/context'

import { Search } from '../../search'
import { RenderSearch } from './helpers/RenderSearch'

interface SearchModalProps {
  products: any[]
  articles: any[]
}

export const SearchModal = (props: SearchModalProps) => {
  const { products, articles } = props
  const { isSearchOpen, handleCloseSearch } = useSearch()

  return (
    <Transition.Root show={isSearchOpen} as={Fragment}>
      <Dialog as="div" className=" inset-0 z-[100]" onClose={handleCloseSearch}>
        <div className="absolute inset-0 z-10 overflow-hidden">
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
              className="fixed inset-0 top-0 -z-50 bg-gray-500/70 transition-opacity"
              onMouseOver={handleCloseSearch}
            />
          </Transition.Child>

          <div className="fixed inset-x-0 mt-[calc(var(--navbar-height)_+_var(--announcement-bar-height))] flex max-w-full bg-colorFifteen">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-y-full"
              enterTo="translate-y-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <section className="block h-[620px] w-full overflow-y-auto">
                <Search products={products} articles={articles} />
                <RenderSearch products={products} articles={articles} />
              </section>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
