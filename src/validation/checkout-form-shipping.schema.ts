import { z } from 'zod'

export const checkoutFormShippingSchema = z.object({
  firstName: z.string().min(1, 'Please enter a first name'),
  lastName: z.string().min(1, 'Please enter a last name'),
  phone: z
    .string()
    .regex(/^[0-9]{8,10}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  address1: z.string().min(1, 'Please enter an address'),
  address2: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().min(1, 'Please enter a state'),
  postcode: z.string().min(4, 'Please enter a postcode').max(4, 'Please enter a postcode'),
  country: z.string().optional()
})

export type CheckoutFormShippingInput = z.TypeOf<typeof checkoutFormShippingSchema>
