import { z } from 'zod'

export const accountNewsletterSubscriptionSchema = z.object({
  username: z.string().min(1, 'Please enter a username')
})

export type AccountNewsletterSubscriptionSchemaInput = z.TypeOf<
  typeof accountNewsletterSubscriptionSchema
>
