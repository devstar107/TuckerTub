import type { HTMLAttributes, PropsWithChildren } from 'react'

import { useSearch } from '~/context'

type MainProps = PropsWithChildren & HTMLAttributes<HTMLDivElement>

export const Main = (props: MainProps) => {
  const { className = '', children } = props
  const { isSearchOpen } = useSearch()

  return (
    <main
      {...props}
      className={`min-h-layoutHeight pt-navbarHeight ${className}`}
      // style={{
      //   paddingTop: isSearchOpen ? '6rem' : '5rem'
      // }}
    >
      {children}
    </main>
  )
}
