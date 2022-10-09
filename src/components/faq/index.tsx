import NextLink from 'next/link'

import { Cursive, CurveBanner, Header, Title, Wrapper } from '~/ui'

import { Accordion } from './accordion'
import { ContactButton } from './contact-btn'
import { MenuItem } from './faq-menu-item'

export const FAQContent = () => {
  return (
    <div className="bg-colorTwelve">
      <CurveBanner>
        <Header className="m-auto text-colorFourteen">FAQ</Header>
      </CurveBanner>
      <Wrapper>
        <div>
          <div className="h-[200px]" />
          <div className="m-auto grid grid-cols-1 pt-20 lg:grid-cols-2 lg:space-x-32">
            <div>
              <Title className="text-colorFourteen">Your Questions, Answered</Title>
              <Cursive className="text-header">We're here to help</Cursive>
              <p className="pt-5 pb-[60px] text-base text-colorFourteen">
                You want to make sure you're feeding your pup what's best for them. We want to help
                you get there. Nose around our FAQs to learn about our products, feeding your dog
                and delivery. Looking to dig deeper? We've got feeding guides and curated expert
                info on dog nutrition and health in{' '}
                <NextLink href="/nutrition" className="font-medium underline">
                  our resource hub
                </NextLink>
                .
              </p>
            </div>
            <MenuItem />
          </div>
          <Accordion />
          <ContactButton />
        </div>
      </Wrapper>
    </div>
  )
}
