import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { FAQContent } from '~/components/faq'

export default function FAQ() {
  return (
    <>
      <NextSeo
        title="FAQ | Tucker Tub"
        description="Tucker Tub's FAQ"
        openGraph={{
          title: 'FAQ | Tucker Tub',
          description: "Tucker Tub's FAQ",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <FAQContent />
      </Layout>
    </>
  )
}
