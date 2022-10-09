/* eslint-disable no-restricted-imports */
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Elements } from '@stripe/react-stripe-js'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Error from 'next/error'
import Head from 'next/head'
import '~/styles/styles.css'

import { initialPaypalOptions } from '~/components/commerce/paypal'
import {
  CartProvider,
  GlobalStateProvider,
  OrderProvider,
  SearchProvider,
  ShopFilterProvider,
  AuthProvider
} from '~/context'
import { getStripe } from '~/lib/Stripe'
import { GoogleAnalytics, ClearModalOnNavigate, LiveChat, Hotjar } from '~/utilities'

import SEO from '../../next-seo.config'

function MyApp({ Component, pageProps }: AppProps) {
  if (pageProps.error) {
    return <Error statusCode={pageProps.error.statusCode} title={pageProps.error.message} />
  }

  const stripePromise = getStripe()

  return (
    <GlobalStateProvider>
      <AuthProvider>
        <SearchProvider>
          <OrderProvider>
            <CartProvider>
              <ShopFilterProvider>
                <ClearModalOnNavigate />
                <GoogleAnalytics />
                <LiveChat />
                <Hotjar />
                <DefaultSeo {...SEO} />
                <PayPalScriptProvider deferLoading={false} options={initialPaypalOptions}>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      appearance: {
                        theme: 'stripe'
                      },
                      fonts: [
                        {
                          family: 'haboro-soft',
                          cssSrc: 'https://use.typekit.net/umo3ziv.css',
                          display: 'swap'
                        }
                      ]
                    }}
                  >
                    <Head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    </Head>
                    <Component {...pageProps} />
                  </Elements>
                </PayPalScriptProvider>
              </ShopFilterProvider>
            </CartProvider>
          </OrderProvider>
        </SearchProvider>
      </AuthProvider>
    </GlobalStateProvider>
  )
}

export default MyApp
