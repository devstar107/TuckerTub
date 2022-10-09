import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

async function RetrievePaypalOrder(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { orderId } = req.body

    if (!orderId) {
      throw new Error('Missing order id')
    }

    const environment = process.env.PAYPAL_SANDBOX === 'true' ? 'sandbox' : 'production'

    const sandboxUrl = 'https://api-m.sandbox.paypal.com'
    const productionUrl = 'https://api.paypal.com'

    const accessTokenBuffer = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
    )
    const accessTokenBase64 = accessTokenBuffer.toString('base64')

    const accessTokenResponse = await fetch(
      `${environment === 'sandbox' ? sandboxUrl : productionUrl}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${accessTokenBase64}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      }
    )

    const accessTokenData = await accessTokenResponse.json()

    console.log('accessTokenData', accessTokenData)

    const orderResponse = await fetch(
      `${environment === 'sandbox' ? sandboxUrl : productionUrl}/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessTokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const orderData = await orderResponse.json()
    console.log('paypalOrderData', orderData)

    return res.status(200).json(orderData)
  } catch (error) {
    console.log('RetrievePaypalOrder Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(RetrievePaypalOrder)
