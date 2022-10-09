/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-use-before-define */
import type { ReactNode } from 'react'
import { useEffect, useReducer, useCallback, createContext, useContext, useMemo } from 'react'

import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'

import {
  TUCKERTUB_AUTH_SESSION_ID,
  WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO
} from '~/constants'

interface IAuthContextStateModifiers {
  login: (payload: any) => void
  logout: () => void
  isLoggedIn: () => boolean
  getUser: () => void
}
interface IAuthContextStateValues {
  user: any
  isAuthenticated: boolean
}

type InitialState = IAuthContextStateModifiers & IAuthContextStateValues

const stateModifiers: IAuthContextStateModifiers = {
  login: () => {},
  logout: () => {},
  isLoggedIn: () => {
    return false
  },
  getUser: () => {}
}

const stateValues: IAuthContextStateValues = {
  user: null,
  isAuthenticated: false
}

const initialState: InitialState = {
  ...stateValues,
  ...stateModifiers
}

const AuthContext = createContext<InitialState>(initialState)

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return context
}

interface Action {
  type: 'LOGOUT' | 'LOGIN' | 'GET_USER'
  payload?: any
}

function authReducer(state: IAuthContextStateValues, action: Action) {
  console.log('Set auth state', state)
  console.log('Set auth payload', action.payload)
  switch (action.type) {
    case 'LOGOUT':
      console.log('LOGOUT running...')

      Cookies.remove(TUCKERTUB_AUTH_SESSION_ID)
      localStorage.removeItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CUSTOMER_INFO)

      return {
        ...state,
        user: null,
        isAuthenticated: false
      }
    case 'LOGIN':
      console.log('LOGIN running...')

      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      }
    case 'GET_USER':
      console.log('GET_USER running...')

      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      }

    default:
      return state
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = useCallback(payload => {
    // console.log('Login payload', payload)
    let decoded = {}
    console.log('payloadlogin', payload)

    if (typeof payload === 'string' && payload?.startsWith('ey')) {
      decoded = jwtDecode(payload)

      return dispatch({
        type: 'LOGIN',
        payload: decoded
      })
    }

    if (payload.jwt) {
      decoded = jwtDecode(payload.jwt)

      return dispatch({
        type: 'LOGIN',
        payload: decoded
      })
    }

    dispatch({
      type: 'LOGIN',
      payload
    })
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const isLoggedIn = useCallback(() => {
    return !!state.user
  }, [state.user])

  const getUser = useCallback(() => {
    dispatch({ type: 'GET_USER' })
  }, [])

  useEffect(() => {
    console.log('useEffectUser', state.user)
    console.log('useEffectIsAuthenticated', state.isAuthenticated)
  }, [state.user])

  useEffect(() => {
    if (Cookies.get(TUCKERTUB_AUTH_SESSION_ID)) {
      validateJWT()
    }

    async function validateJWT() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/verify-jwt-token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: Cookies.get(TUCKERTUB_AUTH_SESSION_ID)
          })
        }
      )
      const data = await response.json()

      console.log('validateJWT data', data)

      if (data.error) {
        return logout()
      }

      login(data)

      console.log('ValidateJWT effect', data)
    }
  }, [])

  const memoizedContextValues = useMemo(() => {
    return {
      ...state,
      login,
      logout,
      isLoggedIn,
      getUser,
      user: state.user,
      isAuthenticated: state.isAuthenticated
    }
  }, [state, login, logout, isLoggedIn, getUser])

  return <AuthContext.Provider value={memoizedContextValues}>{children}</AuthContext.Provider>
}
