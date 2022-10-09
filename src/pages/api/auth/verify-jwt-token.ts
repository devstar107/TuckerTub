import { withSentry } from '@sentry/nextjs'
import JWT from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

async function VerifyJWTTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        error: 'Missing token'
      })
    }

    console.log('Token????', token)

    const secret = process.env.JWT_SECRET as string
    console.log('Secret????', secret)

    const JWTResult = JWT.verify(token, secret, (err, payload) => {
      if (err) {
        console.log('JWTResult Error', err)

        throw err
      }
      return payload
    })

    console.log('VerifyJWTTokenHandler data', JWTResult)

    return res.status(200).json(JWTResult)
  } catch (error) {
    console.log('VerifyJWTTokenHandler Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(VerifyJWTTokenHandler)
