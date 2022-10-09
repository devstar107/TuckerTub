import { z } from 'zod'

export const accountUsernameSchema = z.object({
  firstName: z
    .string()
    .min(1, {
      message: 'First name must be at least 1 character'
    })
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(1, {
      message: 'Last name must be at least 1 character'
    })
    .optional()
    .or(z.literal(''))
})

export type AccountUsernameSchemaInput = z.TypeOf<typeof accountUsernameSchema>
