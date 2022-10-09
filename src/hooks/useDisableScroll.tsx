import { useEffect } from 'react'

export function useDisableBodyScroll(navbarOpen: boolean) {
  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [navbarOpen])
}
