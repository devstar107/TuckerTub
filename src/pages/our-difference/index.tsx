import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { OurDifferenceContent } from '~/components/ourDifference'

export default function OurDifference() {
  return (
    <>
      <NextSeo
        title="Our Difference | Tucker Tub"
        description="Tucker Tub's Our Difference"
        openGraph={{
          title: 'Our Difference | Tucker Tub',
          description: "Tucker Tub's Our Difference",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <OurDifferenceContent />
      </Layout>
    </>
  )
}
