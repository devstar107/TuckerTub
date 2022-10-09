import shippingData from '~/data/woocommerce-shipping-data/shipping-data.json'
import type { CheckoutFormShippingInput } from '~/validation'

export const checkCompatibleShippingZone = (values: CheckoutFormShippingInput, cart: any) => {
  const refrigeratedItems = cart.lineItems.filter(item => {
    return item.shipping_class === 'refrigerated'
  })

  const compatiblePostCode =
    shippingData.zones.find(zone => {
      return zone.postcodes.find(postcode => {
        console.log('postcode', postcode)
        return postcode === values.postcode
      })
    }) ?? null

  const australiaShipping = shippingData.australia

  const shippingOptions = compatiblePostCode ?? australiaShipping

  console.log('shippingOptions', shippingOptions)
  console.log('checkCompatibleShippingZone_refrigeratedItems', refrigeratedItems)

  if (!compatiblePostCode && refrigeratedItems.length) {
    return false
  }

  if (!shippingOptions) {
    return false
  }

  return shippingOptions
}
