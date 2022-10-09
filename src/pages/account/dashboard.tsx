import { useEffect } from 'react'

import cookie from 'cookie'
import type { GetServerSidePropsContext } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import { SettingPage } from '~/components/account/settingPage'
import { Layout } from '~/components/common'
import { TUCKERTUB_AUTH_SESSION_ID } from '~/constants'
import { useAuth } from '~/context'

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth()
  console.log('user', user)
  console.log('isAuthenticated', isAuthenticated)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`)
    }
  }, [isAuthenticated, router])

  return (
    <>
      <NextSeo
        title="Dashboard | Tucker Tub"
        description="Tucker Tub's Dashboard"
        openGraph={{
          title: 'Dashboard | Tucker Tub',
          description: "Tucker Tub's Dashboard",
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <Layout>
        <div className="min-h-inherit bg-colorFifteen">
          <SettingPage />
        </div>
      </Layout>
    </>
  )
}

export default Dashboard

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

  if (!response.ok) {
    console.log('pages/account/dashboard - verifyJWTTOKEN NOT OK - redirecting', data)
    return {
      redirect: {
        destination: `${process.env.FRONTEND_URL}`,
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
