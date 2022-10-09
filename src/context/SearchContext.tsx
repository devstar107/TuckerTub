/* eslint-disable @typescript-eslint/no-empty-function */
import type { ChangeEvent, ReactNode } from 'react'
import { useReducer, useCallback, createContext, useContext, useMemo } from 'react'

import type { Product } from '~/types'

interface ISearchContextStateModifiers {
  handleToggleSearch: () => void
  handleActivateSearch: () => void
  handleCloseSearch: () => void
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleClearSearch: () => void
  handleFilteredProducts: (products: Product[]) => void
  handleFilteredArticles: (articles: any[]) => void
  handleSetSearchLoaded: (value: boolean) => void
}

interface ISearchContextStateValues {
  searchQuery: string
  searchLoaded: boolean
  isSearchOpen: boolean
  filteredProducts: Product[]
  filteredArticles: any[]
}

type InitialState = ISearchContextStateModifiers & ISearchContextStateValues

const stateModifiers: ISearchContextStateModifiers = {
  handleToggleSearch: () => {},
  handleActivateSearch: () => {},
  handleCloseSearch: () => {},
  handleSearchChange: () => {},
  handleClearSearch: () => {},
  handleFilteredProducts: () => {},
  handleFilteredArticles: () => {},
  handleSetSearchLoaded: () => {}
}

const stateValues: ISearchContextStateValues = {
  searchQuery: '',
  searchLoaded: false,
  isSearchOpen: false,
  filteredProducts: [],
  filteredArticles: []
}

const initialState: InitialState = {
  ...stateValues,
  ...stateModifiers
}

const SearchContext = createContext<InitialState>(initialState)

export const useSearch = () => {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }

  return context
}

interface Action {
  type:
    | 'TOGGLE_SEARCH'
    | 'ACTIVATE_SEARCH'
    | 'CLOSE_SEARCH'
    | 'UPDATE_SEARCH_QUERY'
    | 'FILTERED_PRODUCTS'
    | 'FILTERED_ARTICLES'
    | 'RESET_SEARCH'
    | 'SET_SEARCH_LOADED'
  payload?: any
}

function searchReducer(state: ISearchContextStateValues, action: Action) {
  switch (action.type) {
    case 'TOGGLE_SEARCH':
      return {
        ...state,
        isSearchOpen: !state.isSearchOpen
      }
    case 'ACTIVATE_SEARCH':
      return {
        ...state,
        isSearchOpen: true
      }
    case 'CLOSE_SEARCH':
      return {
        ...state,
        isSearchOpen: false
      }
    case 'UPDATE_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload
      }
    case 'FILTERED_PRODUCTS':
      return {
        ...state,
        filteredProducts: action.payload
      }
    case 'FILTERED_ARTICLES':
      return {
        ...state,
        filteredArticles: action.payload
      }
    case 'RESET_SEARCH':
      return {
        ...state,
        searchQuery: ''
      }
    case 'SET_SEARCH_LOADED':
      return {
        ...state,
        searchLoaded: action.payload
      }
    default:
      return state
  }
}

interface SearchProviderProps {
  children: ReactNode
}

export const SearchProvider = (props: SearchProviderProps) => {
  const { children } = props
  const [state, dispatch] = useReducer(searchReducer, initialState)

  const handleToggleSearch = useCallback(() => {
    dispatch({ type: 'TOGGLE_SEARCH' })
  }, [])

  const handleActivateSearch = useCallback(() => {
    dispatch({ type: 'ACTIVATE_SEARCH' })
  }, [])

  const handleCloseSearch = useCallback(() => {
    dispatch({ type: 'CLOSE_SEARCH' })
  }, [])

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_SEARCH_QUERY', payload: event.target.value })
  }, [])

  const handleClearSearch = useCallback(() => {
    dispatch({ type: 'RESET_SEARCH' })
  }, [])

  const handleFilteredProducts = useCallback((products: Product[]) => {
    dispatch({ type: 'FILTERED_PRODUCTS', payload: products })
  }, [])

  const handleFilteredArticles = useCallback((articles: any[]) => {
    dispatch({ type: 'FILTERED_ARTICLES', payload: articles })
  }, [])

  const handleSetSearchLoaded = useCallback((loaded: boolean) => {
    dispatch({ type: 'SET_SEARCH_LOADED', payload: loaded })
  }, [])

  const memoizedContextValues = useMemo(() => {
    return {
      ...state,
      handleToggleSearch,
      handleActivateSearch,
      handleCloseSearch,
      handleSearchChange,
      handleClearSearch,
      handleFilteredProducts,
      handleFilteredArticles,
      handleSetSearchLoaded,
      searchLoaded: state.searchLoaded
    }
  }, [
    state,
    handleToggleSearch,
    handleActivateSearch,
    handleCloseSearch,
    handleSearchChange,
    handleClearSearch,
    handleFilteredProducts,
    handleFilteredArticles,
    handleSetSearchLoaded
  ])

  return <SearchContext.Provider value={memoizedContextValues}>{children}</SearchContext.Provider>
}
