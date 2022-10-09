import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { CustomerServiceMap } from './customer-service-map'

export const CustomerServiceAccordion = () => {
  return (
    <div className="w-full">
      <div className="mx-auto w-full rounded-2xl px-2">
        <Disclosure>
          {({ open }) => {
            return (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between text-left text-sm font-medium text-colorFifteen">
                  <p className="p-4 text-md font-bold">Customer Service</p>
                  <ChevronDownIcon className={`${open ? 'rotate-180' : ''} h-5 w-5 `} />
                </Disclosure.Button>
                <Disclosure.Panel className="pb-6 text-sm text-colorFifteen">
                  <CustomerServiceMap />
                </Disclosure.Panel>
              </>
            )
          }}
        </Disclosure>
      </div>
    </div>
  )
}
