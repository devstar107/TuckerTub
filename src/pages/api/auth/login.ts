import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

async function LoginHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { jwtToken } = req.body

    if (!jwtToken) {
      return res.status(400).json({
        error: 'Missing jwtToken'
      })
    }

    const response = await fetch(
      `${process.env.FRONTEND_URL}/?rest_route=/simple-jwt-login/v1/autologin`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      }
    )

    const data = await response.json()

    return res.status(200).json(data)
  } catch (error) {
    console.log('LoginHandler Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(LoginHandler)
