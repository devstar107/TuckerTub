import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

async function ForgotPasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username } = req.body

    if (!username) {
      return res.status(400).json({
        error: 'Missing username'
      })
    }

    const SendResetPasswordEmailMutation = /* GraphQL */ `
      mutation SendPasswordResetEmail($username: String!) {
        sendPasswordResetEmail(input: { username: $username }) {
          clientMutationId
        }
      }
    `

    const response = await fetch(`${process.env.WORDPRESS_ENDPOINT}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: SendResetPasswordEmailMutation,
        variables: {
          username
        }
      })
    })

    const data = await response.json()

    console.log('DATA?', data)

    return res.status(200).json(data)
  } catch (error) {
    console.log('ForgotPasswordHandler Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(ForgotPasswordHandler)
