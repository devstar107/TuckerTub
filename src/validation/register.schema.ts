import { z } from 'zod'

export const registerSchema = z.object({
  firstName: z.string().min(1, 'Please enter a first name'),
  lastName: z.string().min(1, 'Please enter a last name'),
  email: z
    .string()
    .email({
      message: 'Please enter a valid email address'
    })
    .min(1, 'Please enter an email address'),
  password: z.string().min(6, 'Please enter a password of at least 6 characters'),
  isSignUpEmail: z.boolean().optional(),
  isAgreedToTerms: z.boolean().refine(val => {
    return val
  }, 'Please agree to the Terms of Service')
})

export type RegisterSchemaInput = z.TypeOf<typeof registerSchema>
