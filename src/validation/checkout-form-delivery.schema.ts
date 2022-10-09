import { z } from 'zod'

export const checkoutFormDeliverySchema = z.object({
  shippingMethod: z.boolean().refine(val => {
    return val
  }, 'Please select a shipping method')
})

export type CheckoutFormDeliveryInput = z.TypeOf<typeof checkoutFormDeliverySchema>
