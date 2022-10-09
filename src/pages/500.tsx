import Head from 'next/head'

import { Layout } from '~/components/common/layout'

export default function ServerErrorPage() {
  return (
    <>
      <Head>
        <title>500 - Server Error</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout>
        <div className="flex min-h-inherit flex-col items-center justify-center">
          <p>Something went wrong processing this request (500).</p>
          <br />
          <p>Please try again, or wait for the issue report to be investigated.</p>
        </div>
      </Layout>
    </>
  )
}
