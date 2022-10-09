import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { CookiePolicyContent } from '~/components/policies/cookie-policy'

export default function CookiePolicy() {
  return (
    <>
      <NextSeo
        title="Cookie Policy | Tucker Tub"
        description="Tucker Tub's Cookie Policy"
        openGraph={{
          title: 'Cookie Policy | Tucker Tub',
          description: "Tucker Tub's Cookie Policy",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <CookiePolicyContent />
      </Layout>
    </>
  )
}
