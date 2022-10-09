/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import type { ReactNode } from 'react'
import { useState, useReducer, useCallback, createContext, useContext, useMemo } from 'react'

import Cookies from 'js-cookie'

import {
  STRIPE_TUCKERTUB_PAYMENT_INTENT_CLIENT_SECRET,
  STRIPE_TUCKERTUB_PAYMENT_INTENT_ID,
  WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CART
} from '~/constants'

interface ICartContextStateModifiers {
  getCart: () => void
  resetCart: () => void
  setCart: (payload: ICart) => void
  toggleCartModal: () => void
  openCartModal: () => void
  closeCartModal: () => void
  handleIsLoading: (value: boolean) => void
  setCheckoutStep: (payload: any) => void
  setAbortController: (payload: AbortController) => void
}

export interface ICart {
  lineItems: any[]
  subtotal?: number
}

interface ICartContextStateValues {
  cartModalOpen: boolean
  cart: ICart
  loading: boolean
  currentCheckoutStep: 1 | 2 | 3 | 4
  abortController: AbortController | null
  isExpressCheckout: boolean
}

type InitialState = ICartContextStateModifiers & ICartContextStateValues

const stateModifiers: ICartContextStateModifiers = {
  getCart: () => {},
  resetCart: () => {},
  setCart: () => {},
  toggleCartModal: () => {},
  openCartModal: () => {},
  closeCartModal: () => {},
  handleIsLoading: () => {},
  setCheckoutStep: () => {},
  setAbortController: () => {}
}

const stateValues: ICartContextStateValues = {
  cartModalOpen: false,
  cart: {
    lineItems: [],
    subtotal: 0
  },
  loading: false,
  currentCheckoutStep: 1,
  abortController: null,
  isExpressCheckout: false
}

const initialState: InitialState = {
  ...stateValues,
  ...stateModifiers
}

const CartContext = createContext<InitialState>(initialState)

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}

interface Action {
  type: // | 'ADD_TO_CART'
  // | 'REMOVE_FROM_CART'
  | 'RESET_CART'
    | 'SET_CART'
    | 'TOGGLE_CART_MODAL'
    | 'CLOSE_CART_MODAL'
    | 'OPEN_CART_MODAL'
    | 'FILTER_PRODUCTS'
    | 'SET_CURRENT_CHECKOUT_STEP'
  payload?: any
}

function cartReducer(state: ICartContextStateValues, action: Action) {
  switch (action.type) {
    case 'RESET_CART':
      console.log('resetCart running...')

      localStorage.removeItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CART)
      Cookies.remove(STRIPE_TUCKERTUB_PAYMENT_INTENT_CLIENT_SECRET)
      Cookies.remove(STRIPE_TUCKERTUB_PAYMENT_INTENT_ID)

      return {
        ...state,
        cart: {
          lineItems: [],
          subtotal: 0
        }
      }
    case 'SET_CART':
      localStorage.setItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CART, JSON.stringify(action.payload))

      return {
        ...state,
        cart: action.payload
      }
    case 'TOGGLE_CART_MODAL':
      return {
        ...state,
        cartModalOpen: !state.cartModalOpen
      }
    case 'CLOSE_CART_MODAL':
      return {
        ...state,
        cartModalOpen: false
      }
    case 'OPEN_CART_MODAL':
      return {
        ...state,
        cartModalOpen: true
      }
    case 'FILTER_PRODUCTS':
      return {
        ...state,
        products: action.payload
      }
    case 'SET_CURRENT_CHECKOUT_STEP':
      return {
        ...state,
        currentCheckoutStep: action.payload
      }
    default:
      return state
  }
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = (props: CartProviderProps) => {
  const { children } = props
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [loading, setLoading] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())

  const handleIsLoading = useCallback((value: boolean) => {
    setLoading(value)
  }, [])

  const toggleCartModal = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART_MODAL' })
  }, [])

  const openCartModal = useCallback(() => {
    dispatch({ type: 'OPEN_CART_MODAL' })
  }, [])

  const closeCartModal = useCallback(() => {
    dispatch({ type: 'CLOSE_CART_MODAL' })
  }, [])

  const setCart = useCallback((payload: ICart) => {
    const newSubtotal = payload.lineItems.reduce((acc, item) => {
      return acc + item.price * item.quantity
    }, 0)
    return dispatch({ type: 'SET_CART', payload: { ...payload, subtotal: newSubtotal } })
  }, [])

  const resetCart = useCallback(() => {
    return dispatch({ type: 'RESET_CART' })
  }, [])

  const setCheckoutStep = useCallback((payload: 1 | 2 | 3 | 4) => {
    return dispatch({ type: 'SET_CURRENT_CHECKOUT_STEP', payload })
  }, [])

  const memoizedContextValues = useMemo(() => {
    return {
      ...state,
      loading,
      handleIsLoading,
      resetCart,
      setCart,
      cart: state.cart,
      cartModalOpen: state.cartModalOpen,
      toggleCartModal,
      openCartModal,
      closeCartModal,
      setCheckoutStep,
      abortController,
      setAbortController,
      isExpressCheckout: state.currentCheckoutStep === 1
    }
  }, [
    state,
    loading,
    handleIsLoading,
    resetCart,
    setCart,
    toggleCartModal,
    openCartModal,
    closeCartModal,
    setCheckoutStep,
    abortController,
    setAbortController
  ])

  return <CartContext.Provider value={memoizedContextValues}>{children}</CartContext.Provider>
}
