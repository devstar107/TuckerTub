import type { Stripe } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js/pure'

let stripePromise: Promise<Stripe | null>

// uses the singleton pattern and lazy load stripe for performance with pure
// see https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
  }
  return stripePromise
}
