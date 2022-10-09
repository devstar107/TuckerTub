/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import type { ReactNode } from 'react'
import { useReducer, useCallback, createContext, useContext, useMemo } from 'react'

import {
  WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_ORDER,
  WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_ORDER_EMAIL,
  WOOCOMMERCE_TUCKERTUB_ORDER
} from '~/constants'

interface IOrderContextStateModifiers {
  resetOrder: () => void
  setOrder: (payload: any) => void
  setCheckoutView: (payload: {
    isEmailView: boolean
    isOrderAddressView: boolean
    isDeliveryView: boolean
    isPayView: boolean
    isConfirmedThankYouView: boolean
    isIncompatibleShippingView: boolean
  }) => void
  setShippingMethod: (payload: any) => void
  setOrderEmail: (payload: string) => void
}

interface IOrderContextStateValues {
  order: any
  orderEmail: string
  checkoutView: {
    isEmailView: boolean
    isOrderAddressView: boolean
    isDeliveryView: boolean
    isPayView: boolean
    isConfirmedThankYouView: boolean
    isIncompatibleShippingView: boolean
  }
  shippingMethod: any
}

type InitialState = IOrderContextStateModifiers & IOrderContextStateValues

const stateModifiers: IOrderContextStateModifiers = {
  resetOrder: () => {},
  setOrder: () => {},
  setCheckoutView: () => {},
  setOrderEmail: () => {},
  setShippingMethod: () => {}
}

const stateValues: IOrderContextStateValues = {
  order: {},
  orderEmail: '',
  checkoutView: {
    isEmailView: true,
    isOrderAddressView: false,
    isDeliveryView: false,
    isPayView: false,
    isConfirmedThankYouView: false,
    isIncompatibleShippingView: false
  },
  shippingMethod: {}
}

const initialState: InitialState = {
  ...stateValues,
  ...stateModifiers
}

const OrderContext = createContext<InitialState>(initialState)

export const useOrder = () => {
  const context = useContext(OrderContext)

  if (!context) {
    throw new Error('useOrder must be used within a OrderProvider')
  }

  return context
}

interface Action {
  type:
    | 'SET_ORDER'
    | 'RESET_ORDER'
    | 'SET_CHECKOUT_VIEW'
    | 'SET_ORDER_EMAIL'
    | 'SET_SHIPPING_METHOD'
  payload?: any
}

function orderReducer(state: IOrderContextStateValues, action: Action) {
  console.log('Set order state', state)
  console.log('Set order payload', action.payload)

  switch (action.type) {
    case 'RESET_ORDER': {
      localStorage.removeItem(WOOCOMMERCE_TUCKERTUB_ORDER)
      localStorage.removeItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_ORDER_EMAIL)

      return {
        ...state
      }
    }
    case 'SET_ORDER':
      localStorage.setItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_ORDER, JSON.stringify(action.payload))

      return {
        ...state,
        order: action.payload
      }
    case 'SET_CHECKOUT_VIEW':
      return {
        ...state,
        checkoutView: action.payload
      }
    case 'SET_ORDER_EMAIL':
      localStorage.setItem(
        WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_ORDER_EMAIL,
        JSON.stringify(action.payload)
      )

      return {
        ...state,
        orderEmail: action.payload
      }

    case 'SET_SHIPPING_METHOD':
      return {
        ...state,
        shippingMethod: action.payload
      }

    default:
      return state
  }
}

interface OrderProviderProps {
  children: ReactNode
}

export const OrderProvider = (props: OrderProviderProps) => {
  const { children } = props
  const [state, dispatch] = useReducer(orderReducer, initialState)

  const resetOrder = useCallback(() => {
    dispatch({ type: 'RESET_ORDER' })
  }, [])

  const setOrder = useCallback((payload: any) => {
    return dispatch({ type: 'SET_ORDER', payload })
  }, [])

  const setCheckoutView = useCallback((payload: any) => {
    return dispatch({ type: 'SET_CHECKOUT_VIEW', payload })
  }, [])

  const setOrderEmail = useCallback((payload: any) => {
    return dispatch({ type: 'SET_ORDER_EMAIL', payload })
  }, [])

  const setShippingMethod = useCallback((payload: any) => {
    return dispatch({ type: 'SET_SHIPPING_METHOD', payload })
  }, [])

  const memoizedContextValues = useMemo(() => {
    return {
      ...state,
      resetOrder,
      setOrder,
      setCheckoutView,
      setOrderEmail,
      order: state.order,
      orderEmail: state.orderEmail,
      shippingMethod: state.shippingMethod,
      setShippingMethod
    }
  }, [state, resetOrder, setOrder, setCheckoutView, setOrderEmail, setShippingMethod])

  return <OrderContext.Provider value={memoizedContextValues}>{children}</OrderContext.Provider>
}
