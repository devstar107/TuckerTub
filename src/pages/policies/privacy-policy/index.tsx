import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { PrivacyPolicyContent } from '~/components/policies/privacy-policy'

export default function PrivacyPolicy() {
  return (
    <>
      <NextSeo
        title="Privacy Policy | Tucker Tub"
        description="Tucker Tub's Privacy Policy"
        openGraph={{
          title: 'Privacy Policy | Tucker Tub',
          description: "Tucker Tub's Privacy Policy",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <PrivacyPolicyContent />
      </Layout>
    </>
  )
}
