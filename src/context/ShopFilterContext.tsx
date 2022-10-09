/* eslint-disable @typescript-eslint/no-empty-function */
import type { ReactNode } from 'react'
import { useReducer, useCallback, createContext, useContext, useMemo } from 'react'

interface IShopFilterContextStateModifiers {
  handleSortByFilter: (sortByFilter: string) => void
  handleCategoryFilter: (categoryFilter: string) => void
  handleProteinFilter: (proteinFilter: string) => void
  handleWeightFilter: (weightFilter: string) => void
  handleTypeFilter: (typeFilter: string) => void
  handleClearFilters: () => void
}

interface IShopFilterContextStateValues {
  sortByFilter: string
  categoryFilter: string
  proteinFilter: string
  weightFilter: string
  typeFilter: string
}

type InitialState = IShopFilterContextStateModifiers & IShopFilterContextStateValues

const stateModifiers: IShopFilterContextStateModifiers = {
  handleSortByFilter: () => {},
  handleCategoryFilter: () => {},
  handleProteinFilter: () => {},
  handleWeightFilter: () => {},
  handleTypeFilter: () => {},
  handleClearFilters: () => {}
}

const stateValues: IShopFilterContextStateValues = {
  sortByFilter: '',
  categoryFilter: '',
  proteinFilter: '',
  weightFilter: '',
  typeFilter: ''
}

const initialState: InitialState = {
  ...stateValues,
  ...stateModifiers
}

const ShopFilterContext = createContext<InitialState>(initialState)

export const useShopFilter = () => {
  const context = useContext(ShopFilterContext)

  if (!context) {
    throw new Error('useShopFilter must be used within a ShopFilterProvider')
  }

  return context
}

interface Action {
  type:
    | 'CHANGE_SORTBY_FILTER'
    | 'CHANGE_CATEGORY_FILTER'
    | 'CHANGE_PROTEIN_FILTER'
    | 'CHANGE_WEIGHT_FILTER'
    | 'CHANGE_TYPE_FILTER'
    | 'CLEAR_FILTERS'
  payload?: any
}

function shopFilterReducer(state: IShopFilterContextStateValues, action: Action) {
  console.log('payload', action.payload)
  switch (action.type) {
    case 'CHANGE_SORTBY_FILTER':
      return {
        ...state,
        sortByFilter: action.payload
      }
    case 'CHANGE_CATEGORY_FILTER':
      return {
        ...state,
        categoryFilter: action.payload
      }
    case 'CHANGE_PROTEIN_FILTER':
      return {
        ...state,
        proteinFilter: action.payload
      }
    case 'CHANGE_WEIGHT_FILTER':
      return {
        ...state,
        weightFilter: action.payload
      }
    case 'CHANGE_TYPE_FILTER':
      return {
        ...state,
        typeFilter: action.payload
      }
    case 'CLEAR_FILTERS':
      return {
        ...state,
        sortByFilter: '',
        categoryFilter: '',
        proteinFilter: '',
        weightFilter: '',
        typeFilter: ''
      }
    default:
      return state
  }
}

interface ShopFilterProviderProps {
  children: ReactNode
}

export const ShopFilterProvider = (props: ShopFilterProviderProps) => {
  const { children } = props
  const [state, dispatch] = useReducer(shopFilterReducer, initialState)

  const handleSortByFilter = useCallback((sortByFilterValue: string) => {
    dispatch({ type: 'CHANGE_SORTBY_FILTER', payload: sortByFilterValue })
  }, [])

  const handleCategoryFilter = useCallback((categoryFilterValue: string) => {
    dispatch({ type: 'CHANGE_CATEGORY_FILTER', payload: categoryFilterValue })
  }, [])

  const handleProteinFilter = useCallback((proteinFilterValue: string) => {
    dispatch({ type: 'CHANGE_PROTEIN_FILTER', payload: proteinFilterValue })
  }, [])

  const handleWeightFilter = useCallback((weightFilterValue: string) => {
    dispatch({ type: 'CHANGE_WEIGHT_FILTER', payload: weightFilterValue })
  }, [])

  const handleTypeFilter = useCallback((typeFilterValue: string) => {
    dispatch({ type: 'CHANGE_TYPE_FILTER', payload: typeFilterValue })
  }, [])

  const handleClearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' })
  }, [])

  const memoizedContextValues = useMemo(() => {
    return {
      ...state,
      handleSortByFilter,
      handleCategoryFilter,
      handleProteinFilter,
      handleWeightFilter,
      handleTypeFilter,
      handleClearFilters
    }
  }, [
    state,
    handleSortByFilter,
    handleCategoryFilter,
    handleProteinFilter,
    handleWeightFilter,
    handleTypeFilter,
    handleClearFilters
  ])

  return (
    <ShopFilterContext.Provider value={memoizedContextValues}>
      {children}
    </ShopFilterContext.Provider>
  )
}
