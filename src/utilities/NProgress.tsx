import { useEffect } from 'react'

import { useRouter } from 'next/router'
import nprogress from 'nprogress'

// This component provides a minimal progress indicator at the header of the page
// when navigating between pages.
export function NProgress() {
  const router = useRouter()

  nprogress.configure({
    showSpinner: false
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout

    function start() {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        return nprogress.start()
      }, 100)
    }

    function done() {
      clearTimeout(timeout)
      nprogress.done()
    }

    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', done)
    router.events.on('routeChangeError', done)
    return () => {
      done()
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', done)
      router.events.off('routeChangeError', done)
    }
  }, [router.events])

  return null
}