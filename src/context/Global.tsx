/* eslint-disable @typescript-eslint/no-empty-function */
import type { MouseEvent, ReactNode } from 'react'
import { useCallback, useMemo, createContext, useContext, useState } from 'react'

interface GlobalContext {
  navbarOpen: boolean
  profileOpen: boolean
  isMegaMenuOpen: boolean
  isGrid: boolean
  isMobileMenuOpen: boolean
  isGlobalLoading: boolean
  setIsGlobalLoading: (value: boolean) => void
  closeModalEvent: (event: MouseEvent<HTMLDivElement>) => void
  closeNavbarModal: () => void
  closeMegaMenu: () => void
  closeProfileModal: () => void
  toggleNav: () => void
  toggleProfile: () => void
  toggleGridLayout: () => void
  toggleMegaMenu: () => void
  toggleMobileMenu: () => void
  openMegaMenu: () => void
}

const initialState: GlobalContext = {
  navbarOpen: false,
  profileOpen: false,
  isMegaMenuOpen: false,
  isGrid: false,
  isMobileMenuOpen: false,
  isGlobalLoading: false,
  setIsGlobalLoading: () => {},
  closeModalEvent: () => {},
  closeNavbarModal: () => {},
  closeMegaMenu: () => {},
  closeProfileModal: () => {},
  toggleNav: () => {},
  toggleProfile: () => {},
  toggleGridLayout: () => {},
  toggleMegaMenu: () => {},
  toggleMobileMenu: () => {},
  openMegaMenu: () => {}
}

const GlobalStateContext = createContext<GlobalContext>(initialState)

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)

  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [navbarOpen, setNavbarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isGrid, setIsGrid] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isGlobalLoading, setIsGlobalLoading] = useState(false)

  const closeModalEvent = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const element = event.target as HTMLDivElement

    if (element.id === 'navbar-hamburger-button' || element.id === 'overlay-container') {
      setNavbarOpen(false)
    }
  }, [])

  const closeNavbarModal = useCallback(() => {
    setNavbarOpen(false)
  }, [])

  const closeMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(false)
  }, [])

  const closeProfileModal = useCallback(() => {
    setProfileOpen(false)
  }, [])

  const toggleNav = useCallback(() => {
    setNavbarOpen(prevState => {
      return !prevState
    })
  }, [])

  const toggleProfile = useCallback(() => {
    setProfileOpen(prevState => {
      return !prevState
    })
  }, [])

  const toggleGridLayout = useCallback(() => {
    setIsGrid(prevState => {
      return !prevState
    })
  }, [])

  const toggleMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(prevState => {
      return !prevState
    })
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prevState => {
      return !prevState
    })
  }, [])

  const openMegaMenu = useCallback(() => {
    setIsMegaMenuOpen(true)
  }, [])

  const memoizedValues = useMemo(() => {
    return {
      navbarOpen,
      profileOpen,
      closeProfileModal,
      isGrid,
      isMegaMenuOpen,
      isMobileMenuOpen,
      isGlobalLoading,
      setIsGlobalLoading,
      closeModalEvent,
      closeNavbarModal,
      closeMegaMenu,
      toggleNav,
      toggleProfile,
      toggleGridLayout,
      toggleMegaMenu,
      toggleMobileMenu,
      openMegaMenu
    }
  }, [
    navbarOpen,
    profileOpen,
    closeProfileModal,
    isGrid,
    isMegaMenuOpen,
    isMobileMenuOpen,
    isGlobalLoading,
    setIsGlobalLoading,
    closeModalEvent,
    closeNavbarModal,
    closeMegaMenu,
    toggleNav,
    toggleProfile,
    toggleGridLayout,
    toggleMegaMenu,
    toggleMobileMenu,
    openMegaMenu
  ])

  return (
    <GlobalStateContext.Provider value={memoizedValues}>{children}</GlobalStateContext.Provider>
  )
}
