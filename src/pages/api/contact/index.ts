/* eslint-disable complexity */
import { Client } from '@hubspot/api-client'
import type { SendMessageRequest } from '@mailchimp/mailchimp_transactional'
import mailchimp from '@mailchimp/mailchimp_transactional'
import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

const initializedMailchimpTransactional = mailchimp(process.env.MANDRILL_API_KEY!)

const hubSpotClient = new Client({ apiKey: process.env.HUBSPOT_API_KEY! })

async function Contact(req: NextApiRequest, res: NextApiResponse) {
  const { email, firstName, lastName, message, phone, questionType } = req.body

  if (!email || !firstName || !lastName || !message || !questionType) {
    return res.status(400).json({ error: 'Email, first name, last name and message are required' })
  }

  try {
    const emailMessage: SendMessageRequest['message'] = {
      from_email: 'woof@tuckertub.com.au',
      from_name: `${firstName} ${lastName}`,
      headers: {
        'Reply-To': email
      },
      to: [
        {
          email: 'woof@tuckertub.com.au',
          name: `${firstName} ${lastName}`,
          type: 'to'
        }
      ],
      subject: 'Message from customer',
      html: `<h1>Message from ${firstName} ${lastName}</h1>
      <p>Message: ${message}</p>
      ${phone ? `<p>Phone: ${phone}</p>` : ''}
      <p>Email: ${email}</p>
      ${questionType ? `<p>Question type: ${questionType}</p>` : ''}`
    }

    const response = await initializedMailchimpTransactional.messages.send({
      message: emailMessage
    })

    const allContacts = await hubSpotClient.crm.contacts.getAll()

    // if contact already exists inside HubSpot, update it, otherwise create a new contact

    const existingContact = allContacts.find(contact => {
      return contact.properties.email === email
    })

    if (existingContact) {
      await hubSpotClient.crm.contacts.basicApi.update(existingContact.id, {
        properties: {
          firstname: firstName,
          lastname: lastName,
          phone,
          email
        }
      })
    } else {
      await hubSpotClient.crm.contacts.basicApi.create({
        properties: {
          firstname: firstName,
          lastname: lastName,
          email,
          phone
        }
      })
    }
    console.log('Sent message', response)

    return res.status(200).send('Message sent')
  } catch (error) {
    console.log('Contact API Error', error)
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message || error.toString() })
    }

    return res.status(500).json({
      error: 'An unknown error occurred'
    })
  }
}

export default withSentry(Contact)
