/* eslint-disable complexity */
import type { SendMessageRequest } from '@mailchimp/mailchimp_transactional'
import mailchimp from '@mailchimp/mailchimp_transactional'
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

const initializedMailchimpTransactional = mailchimp(process.env.MANDRILL_API_KEY!)

async function SendPasswordResetEmail(req: NextApiRequest, res: NextApiResponse) {
  const { to, subject, message } = req.body

  console.log('SendPasswordResetEmail REQBODY', req.body)

  if (!to || !subject || !message) {
    return res.status(400).json({
      error: 'Must provide to, subject, and message'
    })
  }

  try {
    const emailMessage: SendMessageRequest['message'] = {
      from_email: 'woof@tuckertub.com.au',
      from_name: `Tucker Tub`,
      to: [
        {
          email: to,
          type: 'to'
        }
      ],
      subject,
      html: message
    }

    const response = await initializedMailchimpTransactional.messages.send({
      message: emailMessage
    })

    console.log('Sent message', response)

    return res.status(200).send('Message sent')
  } catch (error) {
    console.log('SendPasswordResetEmail API Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(SendPasswordResetEmail)
