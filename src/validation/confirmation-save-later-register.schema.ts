import { z } from 'zod'

export const confirmationSaveLaterRegisterSchema = z.object({
  password: z.string().min(6, 'Please enter a password of at least 6 characters')
})

export type ConfirmationSaveLaterRegisterSchemaInput = z.TypeOf<
  typeof confirmationSaveLaterRegisterSchema
>
