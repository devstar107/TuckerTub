import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { ShippingAndDeliveryContent } from '~/components/policies'

export default function ShippingAndDelivery() {
  return (
    <>
      <NextSeo
        title="Shipping & Delivery | Tucker Tub"
        description="Tucker Tub's Shipping & Delivery Policy"
        openGraph={{
          title: 'Shipping & Delivery | Tucker Tub',
          description: "Tucker Tub's Shipping & Delivery Policy",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <ShippingAndDeliveryContent />
      </Layout>
    </>
  )
}
