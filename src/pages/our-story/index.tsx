import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { OurStoryContent } from '~/components/ourStory'

export default function OurStory() {
  return (
    <>
      <NextSeo
        title="Our Story | Tucker Tub"
        description="Tucker Tub's Our Story"
        openGraph={{
          title: 'Our Story | Tucker Tub',
          description: "Tucker Tub's Our Story",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <OurStoryContent />
      </Layout>
    </>
  )
}
