import type { ReactNode } from 'react'

import { Layout } from '~/components/common'

import { Wrapper } from './wrapper'

interface PageContainerProps {
  children: ReactNode
}

export const PageContainer = (props: PageContainerProps) => {
  const { children } = props
  return (
    <Layout>
      <div className="w-full min-h-inherit bg-colorFifteen">
        <Wrapper className="m-auto w-[80%] pt-5 pb-8">{children}</Wrapper>
      </div>
    </Layout>
  )
}
