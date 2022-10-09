import { CustomerServiceAccordion } from './accordion-customer'
import { NavLinksAccordion } from './accordion-navlinks'
import { CopyRightFooter } from './copyright'
import { CustomerServiceMap } from './customer-service-map'
import { LogoFooter } from './logo-footer'
import { NavLinksMap } from './nav-links-map'
import { PaymentsFooter } from './payments-footer'
import { SocialFooter } from './social'

export const Footer = () => {
  return (
    <footer className="bg-colorFourteen p-8 text-colorFifteen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        <LogoFooter className="col-span-2 md:col-span-1" />
        <div className="my-6 hidden border-y-2 py-6 sm:col-span-full sm:flex sm:flex-col sm:justify-center md:col-span-1 md:my-0 lg:hidden">
          <NavLinksAccordion />
          <CustomerServiceAccordion />
        </div>
        <div className="col-start-2 col-end-4 hidden grid-cols-2 gap-20 justify-self-center lg:grid">
          <div className="w-full">
            <p className="py-4 text-md font-bold">Tucker Tub</p>
            <NavLinksMap />
          </div>
          <div className="w-full">
            <p className="py-4 text-md font-bold">Customer Service</p>
            <CustomerServiceMap />
          </div>
        </div>
        <div className="grid sm:col-span-2 sm:grid-cols-2 md:grid-cols-2 lg:col-start-4 lg:grid-cols-1">
          <PaymentsFooter />
          <div className="my-6 block border-y-2 py-4 sm:hidden">
            <NavLinksAccordion />
            <CustomerServiceAccordion />
          </div>
          <SocialFooter />
        </div>
      </div>
      <CopyRightFooter />
    </footer>
  )
}
