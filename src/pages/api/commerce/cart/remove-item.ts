import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

async function RemoveItem(req: NextApiRequest, res: NextApiResponse) {
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

    // we have the same item in cart, we find it and remove it entirely
    // the syntax is so weird, but passing in the id, product_id as 0 and quantity as 0 makes it work
    if (currentLineItem) {
      const removedProduct = {
        id: currentLineItem.id,
        product_id: 0,
        quantity: 0
      }

      const { data: removeLineItemData } = await wooCommerceAPI.put(`orders/${cartId}`, {
        line_items: [removedProduct]
      })

      return res.status(200).json(removeLineItemData)
    }
  } catch (error) {
    console.log('RemoveItem Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(RemoveItem)
