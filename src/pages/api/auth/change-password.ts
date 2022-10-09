import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

async function ChangePasswordHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { key, email, newPassword } = req.body

    if (!key) {
      return res.status(400).json({
        error: 'Missing code'
      })
    }

    if (!email) {
      return res.status(400).json({
        error: 'Missing email'
      })
    }
    if (!newPassword) {
      return res.status(400).json({
        error: 'Missing new password'
      })
    }

    const ResetUserPasswordMutation = /* GraphQL */ `
      mutation ResetUserPassword($key: String!, $login: String!, $password: String!) {
        resetUserPassword(input: { key: $key, login: $login, password: $password }) {
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
        query: ResetUserPasswordMutation,
        variables: {
          key,
          login: email,
          password: newPassword
        }
      })
    })

    console.log('Response', response)

    const data = await response.json()

    console.log('DATA?', data)

    return res.status(200).json(data)
  } catch (error) {
    console.log('ChangePasswordHandler Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(ChangePasswordHandler)
