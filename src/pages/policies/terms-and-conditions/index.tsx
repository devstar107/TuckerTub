import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { TermsAndConditionsContent } from '~/components/policies'

export default function TermsAndConditions() {
  return (
    <>
      <NextSeo
        title="Terms of Service | Tucker Tub"
        description="Tucker Tub's Terms of Service"
        openGraph={{
          title: 'Terms of Service | Tucker Tub',
          description: "Tucker Tub's Terms of Service",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <TermsAndConditionsContent />
      </Layout>
    </>
  )
}
