import type { PropsWithChildren } from 'react'

import dynamic from 'next/dynamic'

import { Footer } from './footer'
import { Main } from './main'
import { Navbar } from './navbar'

const DynamicNewsletter = dynamic(
  async () => {
    const component = await import('../newsletter')
    return component.Newsletter
  },
  { ssr: false }
)

const DynamicToaster = dynamic(
  async () => {
    const component = await import('react-hot-toast')
    return component.Toaster
  },
  {
    ssr: false
  }
)

export const Layout = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <div>
      <Navbar />
      <Main>{children}</Main>
      <DynamicNewsletter />
      <DynamicToaster position="bottom-right" />
      <Footer />
    </div>
  )
}
