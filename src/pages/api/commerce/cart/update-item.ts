import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function UpdateItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { variantId, cartId, quantity } = req.body

    if (!variantId) {
      return res.status(400).json({
        error: 'Missing variantId'
      })
    }

    if (!cartId) {
      return res.status(400).json({
        error: 'Missing cartId'
      })
    }

    if (!quantity) {
      return res.status(400).json({
        error: 'Missing quantity'
      })
    }

    const { data: currentOrderData } = await wooCommerceAPI.get(`orders/${cartId}`)

    const currentLineItems = currentOrderData.line_items
    const currentLineItem = currentLineItems.find(lineItem => {
      return lineItem.variation_id === variantId
    })

    // we have the same item, we find it and increment the quantity
    if (currentLineItem) {
      const { data: incrementLineItemData } = await wooCommerceAPI.put(`orders/${cartId}`, {
        line_items: currentLineItems.map(lineItem => {
          if (lineItem.variation_id === variantId) {
            return {
              ...lineItem,
              quantity: lineItem.quantity + quantity
            }
          }

          return lineItem
        })
      })

      console.log('incrementLineItemData', incrementLineItemData)

      return res.status(200).json(incrementLineItemData)
    }

    // we don't have the same item, we add it to the cart with specified quantity
    const { data: addLineItemData } = await wooCommerceAPI.post(`orders/${cartId}`, {
      line_items: [
        ...currentLineItems,
        {
          variation_id: variantId,
          quantity
        }
      ]
    })

    console.log('addLineItemData', addLineItemData)

    return res.status(200).json(addLineItemData)
  } catch (error) {
    console.log('UpdateItem Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(UpdateItem)
