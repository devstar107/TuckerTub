import { z } from 'zod'

export const accountBillingSchema = z.object({
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
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^[0-9]{8,10}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address1: z
    .string()
    .min(1, {
      message: 'Address must be at least 1 character'
    })
    .optional()
    .or(z.literal('')),
  address2: z.string().optional(),
  suburb: z.string().optional(),
  state: z
    .string()
    .min(1, {
      message: 'State must be at least 1 character'
    })
    .optional()
    .or(z.literal('')),
  postcode: z
    .string()
    .min(4, {
      message: 'Postcode must be at least 4 characters'
    })
    .max(4, {
      message: 'Postcode must be at most 4 characters'
    })
    .optional()
    .or(z.literal('')),
  country: z.string().optional()
})

export type AccountBillingInput = z.TypeOf<typeof accountBillingSchema>
