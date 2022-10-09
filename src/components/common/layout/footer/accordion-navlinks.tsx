import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { NavLinksMap } from './nav-links-map'

export const NavLinksAccordion = () => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full px-2">
        <Disclosure>
          {({ open }) => {
            return (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between text-left text-sm font-medium text-colorFifteen">
                  <p className="p-4 text-md font-bold">Tucker Tub</p>
                  <ChevronDownIcon className={`${open ? 'rotate-180' : ''} h-5 w-5`} />
                </Disclosure.Button>
                <Disclosure.Panel className="pb-6 text-sm text-colorFifteen">
                  <NavLinksMap />
                </Disclosure.Panel>
              </>
            )
          }}
        </Disclosure>
      </div>
    </div>
  )
}
