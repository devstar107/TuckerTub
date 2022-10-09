/* eslint-disable @typescript-eslint/no-non-null-assertion */
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

export const wooCommerceAPI = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_ENDPOINT!,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
  version: 'wc/v3'
})
