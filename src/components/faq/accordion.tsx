import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { MenuDB } from '~/constants'

export const Accordion = () => {
  return (
    <div className="m-auto w-full max-w-[735px] space-y-10 text-colorFourteen lg:w-[90%]">
      {MenuDB.map(list => {
        const removeHash = list.url.replace(/^#/, '')
        return (
          <div key={list.id} className="relative w-full">
            <span id={removeHash} className="absolute top-[-140px] block" />
            <h3 className="px-6 text-xl font-bold">{list.title}</h3>
            {list.faq.map(item => {
              return (
                <div key={item.id} className="py-2">
                  <div className="rounded-lg bg-colorFifteen">
                    <Disclosure>
                      {({ open }) => {
                        return (
                          <>
                            <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-colorFifteen py-5 px-8 text-left  text-lg font-bold focus:outline-none focus-visible:ring">
                              <div>{item.question}</div>
                              <ChevronDownIcon
                                className={`${open ? 'rotate-180' : ''} h-8 w-8 text-green-900`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-8 pb-5 text-md text-colorEight">
                              {item.answer}
                            </Disclosure.Panel>
                          </>
                        )
                      }}
                    </Disclosure>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
