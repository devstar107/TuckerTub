import { NextSeo } from 'next-seo'
import Head from 'next/head'
import NextLink from 'next/link'

import { Layout } from '~/components/common'

const NotFoundPage = () => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <NextSeo title="404 | Tucker Tub" />
      <Layout>
        <section className="container">
          <h1>404</h1>
          <p>This page does not exist...</p>
          <NextLink href="/">Go back</NextLink>
        </section>
      </Layout>
    </>
  )
}

export default NotFoundPage
