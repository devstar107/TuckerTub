import { useEffect } from 'react'

import { hotjar } from 'react-hotjar'

export const Hotjar = () => {
  useEffect(() => {
    // Initialise Hotjar only on the client side
    hotjar.initialize(parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID as string, 10), 6)
  }, [])

  return null
}
