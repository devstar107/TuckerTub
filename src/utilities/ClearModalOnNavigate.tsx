import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useCart, useGlobalState, useSearch } from '~/context'

export function ClearModalOnNavigate() {
  const router = useRouter()
  const { handleCloseSearch, isSearchOpen } = useSearch()
  const { closeNavbarModal, isMegaMenuOpen, closeMegaMenu, setIsGlobalLoading } = useGlobalState()
  const { closeCartModal, cartModalOpen } = useCart()

  useEffect(() => {
    if (isMegaMenuOpen && cartModalOpen) {
      closeMegaMenu()
    }

    if (isSearchOpen && cartModalOpen) {
      handleCloseSearch()
    }
  }, [isMegaMenuOpen, isSearchOpen, cartModalOpen, handleCloseSearch, closeMegaMenu])

  useEffect(() => {
    function loading() {
      setIsGlobalLoading(true)
    }

    function clearLoading() {
      setIsGlobalLoading(false)
    }

    function done() {
      handleCloseSearch()
      closeNavbarModal()
      closeCartModal()
      closeMegaMenu()
      clearLoading()
    }

    router.events.on('routeChangeStart', loading)
    router.events.on('routeChangeComplete', done)

    return () => {
      done()
      router.events.off('routeChangeStart', loading)
      router.events.off('routeChangeComplete', done)
    }
  }, [router.events])

  return null
}
