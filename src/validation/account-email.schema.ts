import { z } from 'zod'

export const accountEmailSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Please enter a valid email address'
    })
    .min(1, 'Please enter an email address')
})

export type AccountEmailSchemaInput = z.TypeOf<typeof accountEmailSchema>
