import { NextSeo } from 'next-seo'

import { Layout } from '~/components/common'
import { ConsultationContent } from '~/components/consultation'

const Consultation = () => {
  return (
    <>
      <NextSeo
        title="Consultation | Tucker Tub"
        description="Tucker Tub's Consultation"
        openGraph={{
          title: 'Consultation | Tucker Tub',
          description: "Tucker Tub's Consultation",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <ConsultationContent />
      </Layout>
    </>
  )
}

export default Consultation
