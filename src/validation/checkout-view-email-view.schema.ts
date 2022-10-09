import { z } from 'zod'

export const emailViewSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Please enter a valid email address'
    })
    .min(1, 'Please enter an email address'),
  isSignUpEmail: z.boolean().optional()
})

export type EmailViewSchemaInput = z.TypeOf<typeof emailViewSchema>
