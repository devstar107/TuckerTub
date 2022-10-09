/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'

import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

import { useAuth, useCart } from '~/context'
import { formatMoney } from '~/utilities'

import { AccountBilling } from './account-billing'
import { AccountEmail } from './account-email'
import { AccountNewsletterSubscription } from './account-newsletter-subscription'
import { AccountPassword } from './account-password'
import { AccountShipping } from './account-shipping'
import { AccountUsername } from './account-username'

function TuckerCrewSubscription() {
  return <p>Tucker Crew Subscription</p>
}

export const AccountAccordion = () => {
  const { user } = useAuth()
  const { abortController } = useCart()
  const [errorMessage, setErrorMessage] = useState('')
  const [fetchedOrders, setFetchedOrders] = useState([])

  function ReturnOrders() {
    const orders = fetchedOrders?.map(order => {
      // console.log('ordre', order)
      return (
        <div key={order.id} className="py-2">
          <div className="rounded-lg bg-colorFifteen">
            <Disclosure>
              {({ open }) => {
                return (
                  <>
                    <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-colorFifteen py-5 px-8 text-left  text-lg font-bold focus:outline-none focus-visible:ring">
                      <div>Order #{order.id}</div>
                      <ChevronDownIcon
                        className={`${open ? 'rotate-180' : ''} h-8 w-8 text-green-900`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-8 pb-5 text-md text-colorEight">
                      Order Status: {order.status}
                    </Disclosure.Panel>
                  </>
                )
              }}
            </Disclosure>
          </div>
        </div>
      )
    })

    return <div>{orders}</div>
  }

  const DashboardMenuDB = [
    {
      id: 1,
      title: 'Account Details',
      url: '#account-details',
      faq: [
        {
          id: 1,
          type: 'username',
          title: 'Username',
          component: <AccountUsername />
        },
        {
          id: 2,
          type: 'email',
          title: 'Email',
          component: <AccountEmail />
        },
        {
          id: 3,
          type: 'password',
          title: 'Password',
          component: <AccountPassword />
        }
        // TODO: Add in later
        // {
        //   id: 4,
        //   title: 'Tucker crew subscription',
        //   type: 'newsletter-subscription',
        //   component: <AccountNewsletterSubscription />
        // }
      ]
    },
    {
      id: 2,
      title: 'Orders',
      url: '#orders'
    },
    {
      id: 3,
      title: 'Addresses',
      url: '#addresses',
      faq: [
        {
          id: 1,
          title: 'Shipping Address',
          type: 'account-shipping',
          component: <AccountShipping />
        },
        {
          id: 2,
          title: 'Billing Address',
          type: 'account-billing',
          component: <AccountBilling />
        }
      ]
    }
    // TODO: Stripe save payment method(?)
    // {
    //   id: 4,
    //   title: 'Payment Methods',
    //   url: '#payment-methods'
    // }
  ]

  async function fetchOrders() {
    try {
      if (errorMessage) {
        setErrorMessage('')
      }

      const responseOptions = {
        method: 'POST',
        signal: abortController?.signal,
        body: JSON.stringify({
          customerId: user?.id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/commerce/orders/get-orders`,
        responseOptions
      )
      const data = await response.json()

      console.log('getOrdersData', data)

      if (response.ok) {
        setFetchedOrders(data)
      } else {
        throw new Error(data)
      }
    } catch (error) {
      console.log('fetchOrders error', error)

      setErrorMessage('Something went wrong')
    }
  }

  useEffect(() => {
    async function retrieveOrders() {
      await fetchOrders()
    }

    if (user?.id) {
      retrieveOrders()
    }
  }, [user])

  return (
    <div className="m-auto w-full max-w-[735px] space-y-10 text-colorFourteen lg:w-[90%]">
      {DashboardMenuDB.map(list => {
        const removeHash = list.url.replace(/^#/, '')
        return (
          <div key={list.id} className="relative w-full">
            <span id={removeHash} className="absolute top-[-140px] block" />
            <h3 className="px-6 text-xl font-bold">{list.title}</h3>

            {list.url === '#orders' ? (
              <ReturnOrders />
            ) : (
              list.faq?.map(item => {
                if (item.type === 'username') {
                  return (
                    <div key={item.id} className="py-2">
                      <div className="rounded-lg bg-colorFifteen">
                        <Disclosure>
                          {({ open }) => {
                            return (
                              <>
                                <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-colorFifteen py-5 px-8 text-left  text-lg font-bold focus:outline-none focus-visible:ring">
                                  <div>{item.title}</div>
                                  <ChevronDownIcon
                                    className={`${open ? 'rotate-180' : ''} h-8 w-8 text-green-900`}
                                  />
                                </Disclosure.Button>
                                <Disclosure.Panel className="px-8 pb-5 text-md text-colorEight">
                                  {item.component}
                                </Disclosure.Panel>
                              </>
                            )
                          }}
                        </Disclosure>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={item.id} className="py-2">
                    <div className="rounded-lg bg-colorFifteen">
                      <Disclosure>
                        {({ open }) => {
                          return (
                            <>
                              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-colorFifteen py-5 px-8 text-left  text-lg font-bold focus:outline-none focus-visible:ring">
                                <div>{item.title}</div>
                                <ChevronDownIcon
                                  className={`${open ? 'rotate-180' : ''} h-8 w-8 text-green-900`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="px-8 pb-5 text-md text-colorEight">
                                {item.component}
                              </Disclosure.Panel>
                            </>
                          )
                        }}
                      </Disclosure>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )
      })}
    </div>
  )
}
