import mailchimp from '@mailchimp/mailchimp_marketing'
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER
})

async function Subscribe(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const newSubscriber = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: 'subscribed'
    })

    if (newSubscriber.status === 'subscribed') {
      console.log('💌  Subscribed user to Mailchimp:', newSubscriber)

      return res.status(201).json({
        message: 'Subscribed user to Mailchimp'
      })
    }

    return res.status(400).json({
      error: 'Failed to subscribe user to Mailchimp'
    })
  } catch (error) {
    console.log('Subscribe Error', error)
    if (error?.response?.body.title === 'Member Exists') {
      return res.status(409).json({
        error: 'This email is already subscribed'
      })
    }

    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(Subscribe)
