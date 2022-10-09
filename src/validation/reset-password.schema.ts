import { z } from 'zod'

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(1, 'Please enter a new password')
})

export type ResetPasswordSchemaInput = z.TypeOf<typeof resetPasswordSchema>
