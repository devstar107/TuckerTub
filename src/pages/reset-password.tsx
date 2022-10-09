import cookie from 'cookie'
import type { GetServerSidePropsContext } from 'next'
import { NextSeo } from 'next-seo'

import { ResetPassword } from '~/components/auth/reset-password'
import { Layout } from '~/components/common'
import { TUCKERTUB_AUTH_SESSION_ID } from '~/constants'
import { useAuth } from '~/context'

export default function ResetPass() {
  const { user, isAuthenticated } = useAuth()
  console.log('user', user)
  console.log('isAuthenticated', isAuthenticated)
  return (
    <>
      <NextSeo
        title="Reset Password | Tucker Tub"
        description="Reset Password Description"
        openGraph={{
          title: 'Reset Password  | Tucker Tub',
          description: 'Reset Password Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <div className="min-h-inherit bg-colorFifteen">
          <div className="p-8">
            <section className="container grid min-h-inherit grid-cols-1 space-x-0 py-20 sm:grid-cols-2 sm:space-x-20">
              <ResetPassword />
            </section>
          </div>
        </div>
      </Layout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, query } = context
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
    return {
      redirect: {
        destination: '/account/dashboard',
        permanent: false
      }
    }
  }

  if (!query.key && !query.email) {
    return {
      redirect: {
        destination: '/forgot-password',
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
