/* eslint-disable @next/next/no-img-element */
import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import NextImage from 'next/future/image'

import { Text } from '~/ui'

import { TeamText } from '../../ui/team-text'
import { Consultation } from '../ourDifference/bookconsultation'

export function TeamCard(props) {
  const { data } = props

  return (
    <div className="h-full w-full max-w-[440px] justify-self-center">
      <div className="my-[-80px] ml-[30px]">
        <NextImage
          src={
            data.node.featuredImage?.node.sourceUrl ??
            '/assets/images/product-image-placeholder.svg'
          }
          alt="Team Member"
          width={219}
          height={188}
          className="h-[160px] w-[160px] rounded-full object-cover"
        />
      </div>
      <div className="w-full rounded-lg bg-colorFifteen/10 px-8 pb-8 pt-24 text-colorFifteen">
        <Disclosure>
          {({ open }) => {
            return (
              <>
                <p className="text-lg font-bold">{data.node.title}</p>
                <Disclosure.Button className="flex w-full justify-between rounded-lg text-left text-sm font-medium">
                  <Text>{data.node.Team.memberRegion}</Text>
                  <ChevronDownIcon
                    className={`${open ? 'rotate-180' : ''} h-8 w-8 text-colorFifteen`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="py-2 text-base text-colorFifteen">
                  <div
                    className="prose text-inherit"
                    dangerouslySetInnerHTML={{
                      __html: data.node.Team.bio
                    }}
                  />
                  <div className="flex items-center gap-5 pt-5">
                    <a
                      href={data.node.Team.memberFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <NextImage
                        src="/assets/social/facebook.svg"
                        alt="Facebook"
                        height={24}
                        width={24}
                      />
                    </a>
                    <p>{data.node.Team.memberPhone}</p>
                  </div>
                </Disclosure.Panel>
              </>
            )
          }}
        </Disclosure>
      </div>
    </div>
  )
}
