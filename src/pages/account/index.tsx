import cookie from 'cookie'
import type { GetServerSidePropsContext } from 'next'
import { NextSeo } from 'next-seo'

import { Register } from '~/components/auth/register'
import { SignIn } from '~/components/auth/signin'
import { Layout } from '~/components/common'
import { TUCKERTUB_AUTH_SESSION_ID } from '~/constants'

const Account = () => {
  return (
    <>
      <NextSeo
        title="Account | Tucker Tub"
        description="Tucker Tub Account"
        openGraph={{
          title: 'Account | Tucker Tub',
          description: 'Tucker Tub Account',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <div className="min-h-inherit bg-colorFifteen">
          <section className="container grid min-h-inherit grid-cols-1 space-x-0 py-20  sm:grid-cols-2 sm:space-x-20">
            <SignIn />
            <Register />
          </section>
        </div>
      </Layout>
    </>
  )
}

export default Account

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const cookies = cookie.parse(req.headers.cookie || '')

  const authCookie = cookies[TUCKERTUB_AUTH_SESSION_ID]

  const response = await fetch(`${process.env.FRONTEND_URL}/api/auth/verify-jwt-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: authCookie
    })
  })
  const data = await response.json()

  if (response.ok) {
    console.log('pages/account - verifyJWTTOKEN OK - Going to dashboard', data)
    return {
      redirect: {
        destination: '/account/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {
      data
    }
  }
}
