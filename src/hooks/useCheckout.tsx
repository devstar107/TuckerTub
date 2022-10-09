/* eslint-disable no-nested-ternary */
import { useEffect } from 'react'

import { toast } from 'react-hot-toast'

import { WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CART } from '~/constants'
import { useCart } from '~/context'
import type { Product } from '~/types'

export const useCheckout = () => {
  const { setCart, cart, openCartModal, cartModalOpen } = useCart()

  useEffect(() => {
    console.log('UpdatedCart', cart)
  }, [cart])

  function getOrderQuery() {
    try {
      const existingCart = localStorage.getItem(WOOCOMMERCE_TUCKERTUB_LOCALSTORAGE_CART)
      const existingCartState = existingCart ? JSON.parse(existingCart) : null

      console.log('existingCartState', existingCartState)

      if (existingCartState) {
        // toast.success('Found existing cart!')
        setCart({
          ...cart,
          lineItems: existingCartState.lineItems
        })
      } else {
        // toast.success('Did not find existing cart!')

        const newCart = {
          products: [],
          lineItems: [],
          subtotal: 0
        }

        setCart(newCart)
      }
    } catch (error) {
      console.error('getOrderQuery error', error)

      return error
    }
  }

  const fetchExistingCart = async () => {
    try {
      await getOrderQuery()
    } catch (error) {
      if (error instanceof Error) {
        // toast.error(error.message)
        console.error('fetchExistingCart error', error)
      }
    }
  }

  const addToCart = async (variant: any, product: Product, quantity: number) => {
    console.log('addToCart variant', variant)

    if (!cartModalOpen) {
      openCartModal()
    }

    try {
      if (!variant) {
        // return toast.error('Missing variant')
        return console.error('Missing variant')
      }

      if (!quantity) {
        // return toast.error('Missing quantity')
        return console.error('Missing quantity')
      }

      const currentLineItems = cart.lineItems
      const currentLineItem = currentLineItems.find(lineItem => {
        return lineItem.variation_id === variant.id
      })

      // we have the same item, we find it and increment the quantity
      if (currentLineItem) {
        const newLineItems = currentLineItems.map(lineItem => {
          if (lineItem.variation_id === variant.id) {
            return {
              ...lineItem,
              product,
              quantity: lineItem.quantity + quantity
            }
          }

          return lineItem
        })

        return setCart({
          ...cart,
          lineItems: [...newLineItems]
        })
      }

      // we don't have the same item, we add it to the cart with specified quantity

      setCart({
        ...cart,
        lineItems: [
          ...currentLineItems,
          {
            ...variant,
            variation_id: variant.id,
            quantity,
            product
          }
        ]
      })

      return
    } catch (error) {
      console.log('addToCart error', error)
      if (error instanceof Error) {
        // toast.error(error.message)
        console.error('addToCart error message', error.message)
      }
    }
  }

  const decrementQuantity = async (variant: any) => {
    try {
      if (!variant) {
        // return toast.error('Missing variant')
        return console.error('Missing variant')
      }

      const currentLineItems = cart.lineItems
      const currentLineItem = currentLineItems.find(lineItem => {
        return lineItem.variation_id === variant.id
      })

      if (!currentLineItem) {
        // return toast.error('Could not find item in cart')
        return console.error('Could not find item in cart')
      }

      if (currentLineItem.quantity === 1) {
        // return toast.error('Cannot decrement quantity')
        return console.error('Cannot decrement quantity')
      }

      const newLineItems = currentLineItems.map(lineItem => {
        if (lineItem.variation_id === variant.id) {
          return {
            ...lineItem,
            quantity: lineItem.quantity - 1
          }
        }

        return lineItem
      })

      setCart({
        ...cart,
        lineItems: newLineItems
      })

      // return toast.success('Decremented quantity')
      return console.log('Decremented quantity')
    } catch (error) {
      console.log('decrementQuantity error', error)
      if (error instanceof Error) {
        // toast.error(error.message)
        console.error('decrementQuantity error message', error.message)
      }
    }
  }

  const incrementQuantity = async (variant: any) => {
    try {
      if (!variant) {
        // return toast.error('Missing variant')
        return console.error('Missing variant')
      }

      console.log('incrementQuantity variant', variant)

      const currentLineItems = cart.lineItems
      console.log('currentLineItems', currentLineItems)
      const currentLineItem = currentLineItems.find(lineItem => {
        return lineItem.variation_id === variant.id
      })

      if (!currentLineItem) {
        // return toast.error('Could not find item in cart')
        return console.error('Could not find item in cart')
      }

      const newLineItems = currentLineItems.map(lineItem => {
        if (lineItem.variation_id === variant.id) {
          return {
            ...lineItem,
            quantity: lineItem.quantity + 1
          }
        }

        return lineItem
      })

      setCart({
        ...cart,
        lineItems: newLineItems
      })

      // return toast.success('incrementQuantity quantity')
      return console.log('incrementQuantity quantity')
    } catch (error) {
      console.log('incrementQuantity error', error)
      if (error instanceof Error) {
        // toast.error(error.message)
        console.error('incrementQuantity error message', error.message)
      }
    }
  }

  const removeFromCart = async (variant: any) => {
    try {
      if (!variant) {
        // return toast.error('Missing variant')
        return console.error('Missing variant')
      }

      const currentLineItems = cart.lineItems
      const currentLineItem = currentLineItems.find(lineItem => {
        return lineItem.variation_id === variant.id
      })

      // we have the same item in cart, we find it and remove it entirely

      if (currentLineItem) {
        const newLineItems = currentLineItems.filter(lineItem => {
          return lineItem.variation_id !== variant.id
        })

        setCart({
          ...cart,
          lineItems: newLineItems
        })

        console.log('newLineItems', newLineItems)
        // return toast.success('Removed from cart!')
      }
    } catch (error) {
      if (error instanceof Error) {
        // toast.error(error.message)
        console.error('removeFromCart error', error)
      }
    }
  }

  useEffect(() => {
    // run once to fetch existing cart or create a new one
    fetchExistingCart()
  }, [])

  return {
    cart,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart
  }
}
