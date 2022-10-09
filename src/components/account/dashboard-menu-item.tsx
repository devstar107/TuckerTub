import { ArrowRightIcon } from '@heroicons/react/solid'
import NextLink from 'next/link'

import { useAuth } from '~/context'

const DashboardMenuDB = [
  {
    id: 1,
    title: 'Account Details',
    url: '#account-details'
  },
  {
    id: 2,
    title: 'Orders',
    url: '#orders'
  },
  {
    id: 3,
    title: 'Addresses',
    url: '#addresses'
  }
  // TODO: Stripe save payment method(?)
  // {
  //   id: 4,
  //   title: 'Payment Methods',
  //   url: '#payment-methods'
  // }
]

export const DashboardMenuItems = () => {
  const { logout } = useAuth()

  return (
    <div className="space-y-4 pb-12 text-lg font-bold text-colorFourteen">
      {DashboardMenuDB.map(item => {
        return (
          <NextLink
            key={item.id}
            href={item.url}
            className="flex items-center justify-start gap-2 text-lg"
          >
            {item.title}
            <ArrowRightIcon className="h-5 w-5" />
          </NextLink>
        )
      })}
      <button
        type="button"
        onClick={() => {
          logout()
        }}
        className="text-base font-normal underline"
      >
        Sign Out
      </button>
    </div>
  )
}
