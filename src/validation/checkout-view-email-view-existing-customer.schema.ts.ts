import { z } from 'zod'

export const emailViewExistingCustomerSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Please enter a valid email address'
    })
    .min(1, 'Please enter an email address'),
  password: z.string().min(1, 'Please enter a password')
})

export type EmailViewExistingCustomerSchemaInput = z.TypeOf<typeof emailViewExistingCustomerSchema>
