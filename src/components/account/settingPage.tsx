import NextLink from 'next/link'

import { useAuth } from '~/context'
import { Cursive, CurveBanner, Header, Title, Wrapper } from '~/ui'

import { ContactButton } from '../faq/contact-btn'
import { AccountAccordion } from './account-accordion'
import { DashboardMenuItems } from './dashboard-menu-item'

export function SettingPage() {
  const { user } = useAuth()
  console.log('SettingPage-user', user)
  return (
    <div className="bg-colorTwelve">
      <CurveBanner>
        <Header className="m-auto text-colorFourteen">Account</Header>
      </CurveBanner>
      <Wrapper>
        <div>
          <div className="h-[200px]" />
          <div className="m-auto grid grid-cols-1 pt-20 lg:grid-cols-2 lg:space-x-32">
            <div>
              <Title className="text-colorFourteen">
                Welcome back {user?.first_name ?? user?.username}
              </Title>
              <Cursive className="text-header">Woof woof, hello!</Cursive>
              <p className="pt-5 pb-[60px] text-base text-colorFourteen">
                Thanks for being a Tucker Tub customer. We’re pleased you want to make sure you’re
                feeding your pup what’s best for them. In your account hub you can keep your details
                up to date, view your orders and more. If you need a hand, feel free to{' '}
                <NextLink href="/contact" className="font-medium underline">
                  contact us
                </NextLink>
                .
              </p>
            </div>
            <DashboardMenuItems />
          </div>
          <AccountAccordion />
          <ContactButton />
        </div>
      </Wrapper>
    </div>
  )
}
