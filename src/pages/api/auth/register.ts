import { withSentry } from '@sentry/nextjs'
import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'

import { TUCKERTUB_AUTH_SESSION_ID } from '~/constants'

async function RegisterHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, firstName, lastName } = req.body

    if (!email) {
      return res.status(400).json({
        error: 'Missing email'
      })
    }

    if (!password) {
      return res.status(400).json({
        error: 'Missing password'
      })
    }

    const response = await fetch(
      `${process.env.WORDPRESS_ENDPOINT}/?rest_route=/simple-jwt-login/v1/users&email=${email}&password=${password}&first_name=${firstName}&last_name=${lastName}&AUTH_KEY=123`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    const serializedCookie = cookie.serialize(TUCKERTUB_AUTH_SESSION_ID, data.jwt, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: Number(process.env.CART_COOKIE_MAX_AGE),
      sameSite: 'strict',
      path: '/'
    })

    console.log('registerSerializedCookie', serializedCookie)

    res.setHeader('Set-Cookie', serializedCookie)

    // register user in woocommerce as well
    // const woocommerceResponse = await wooCommerceAPI.post('customers', {
    //   email,
    //   password,
    //   first_name: '',
    //   last_name: ''
    // })

    // console.log('woocommerceResponse', woocommerceResponse)

    console.log('DATA?', data)

    return res.status(200).json(data)
  } catch (error) {
    console.log('RegisterHandler Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(RegisterHandler)
