import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function DecrementItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { variantId, cartId } = req.body

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

    const { data: currentOrderData } = await wooCommerceAPI.get(`orders/${cartId}`)

    const currentLineItems = currentOrderData.line_items
    const currentLineItem = currentLineItems.find(lineItem => {
      return lineItem.variation_id === variantId
    })

    // we have the same item, we find it and decrement the quantity
    if (currentLineItem) {
      const { data: decrementLineItemData } = await wooCommerceAPI.put(`orders/${cartId}`, {
        line_items: currentLineItems.map(lineItem => {
          if (lineItem.variation_id === variantId) {
            return {
              ...lineItem,
              quantity: lineItem.quantity - 1
            }
          }

          return lineItem
        })
      })

      console.log('decrementLineItemData', decrementLineItemData)
      return res.status(200).json(decrementLineItemData)
    }
  } catch (error) {
    console.log('DecrementItem Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(DecrementItem)
