/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable complexity */
/* eslint-disable no-case-declarations */
import crypto from 'crypto'
import fs from 'fs'
import type { Readable } from 'node:stream'
import path from 'path'

import { withSentry } from '@sentry/nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { wooCommerceAPI } from '~/lib/WooCommerce'

// woocommerce_shipping_zone_method_added - secret
const shippingZoneMethodAddedSecret = 'rW@07FZbonqvH>y5]j^QOzGOc!<rX,,uL~#I~<||&?:RQ_(&/r'
// woocommerce_shipping_zone_method_deleted - secret
const shippingZoneMethodDeletedSecret = '!9X|/&9,Qe |.VET(N-ax?o8Ja@EV7Yb#%.7o.x:^h.a]KH=k|'
// woocommerce_delete_shipping_zone - secret
const shippingZoneDeletedSecret = '.$b:c-wsKT)9/Dot{%E 4et.hE^t|j{A>|]*]kr;&zyK@cZbHE'
// woocommerce_shipping_zone_shipping_methods - secret
const shippingZoneShippingMethodsSecret = 'xwQ6:#x-,6n65l)R&@7N+n*pC4Z5Bh.2Kdi=]3Jn,z&^0ln!+['
// woocommerce_shipping_zone_method_status_toggled - secret
const shippingZoneMethodStatusToggled = 'ehsgrTF-5^x?a%DS[MzreTq/$-qb]PSeA:-F{&*[H [fn&H^:p'

export const config = {
  api: {
    bodyParser: false
  }
}

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

const validateSignature = (
  body: string,
  signature: string | string[] | undefined,
  secret: string
) => {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(body)
  const digest = hmac.digest('base64')

  return digest === signature
}

async function WooCommerceWebhook(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({
      error: 'Method not allowed'
    })
  }

  console.log('REQHeaders', req.headers)

  try {
    // const signature = req.headers['x-wc-webhook-signature'] ?? ''

    // if (!signature) {
    //   console.log(`⚠️  Webhook signature verification failed.`)
    //   return res.status(400).json({
    //     error: 'Webhook signature verification failed.'
    //   })
    // }

    // console.log('SIGNATURE?', signature)

    const buf = await buffer(req)
    console.log('buf?', buf)
    const rawBody = buf.toString('utf8')
    console.log('RAWBODY?', rawBody)

    if (rawBody.includes('webhook_id')) {
      return res.status(200).json({
        message: 'Webhook ID verified.'
      })
    }

    const parsedBody = JSON.parse(rawBody)
    console.log('PARSEDBODY?', parsedBody)
    const { action } = parsedBody ?? {}

    if (!action) {
      console.log('⚠️  No action found in webhook body.')
      return res.status(400).json({
        error: 'No action found in webhook body.'
      })
    }

    console.log('ACTION???????', action)

    console.log('UNWRAPBUFFER', rawBody)

    // if (action === 'woocommerce_shipping_zone_method_added') {
    //   if (!validateSignature(rawBody, signature, shippingZoneMethodAddedSecret)) {
    //     console.log(`⚠️  Webhook signature verification failed.`)
    //     return res.status(400).json({
    //       error: 'Webhook signature verification failed.'
    //     })
    //   }
    // }

    // if (action === 'woocommerce_shipping_zone_method_deleted') {
    //   if (!validateSignature(rawBody, signature, shippingZoneMethodDeletedSecret)) {
    //     console.log(`⚠️  Webhook signature verification failed.`)
    //     return res.status(400).json({
    //       error: 'Webhook signature verification failed.'
    //     })
    //   }
    // }

    // if (action === 'woocommerce_delete_shipping_zone') {
    //   if (!validateSignature(rawBody, signature, shippingZoneDeletedSecret)) {
    //     console.log(`⚠️  Webhook signature verification failed.`)
    //     return res.status(400).json({
    //       error: 'Webhook signature verification failed.'
    //     })
    //   }
    // }

    // if (action === 'woocommerce_shipping_zone_shipping_methods') {
    //   if (!validateSignature(rawBody, signature, shippingZoneShippingMethodsSecret)) {
    //     console.log(`⚠️  Webhook signature verification failed.`)
    //     return res.status(400).json({
    //       error: 'Webhook signature verification failed.'
    //     })
    //   }
    // }

    // if (action === 'woocommerce_shipping_zone_method_status_toggled') {
    //   if (!validateSignature(rawBody, signature, shippingZoneMethodStatusToggled)) {
    //     console.log(`⚠️  Webhook signature verification failed.`)
    //     return res.status(400).json({
    //       error: 'Webhook signature verification failed.'
    //     })
    //   }
    // }

    switch (action) {
      case 'woocommerce_shipping_zone_method_added':
        await updateJSONFile()

        return res.status(200).end()

      case 'woocommerce_shipping_zone_shipping_methods':
        await updateJSONFile()

        return res.status(200).end()
      default:
        console.log(`🔔 Unhandled action type ${action}`)
        break
    }

    return res.status(200).end()
  } catch (error) {
    console.log('WooCommerceWebHook error', error)

    return res.status(500).json({
      error: `Webhook error: ${error}`
    })
  }
}

export default withSentry(WooCommerceWebhook)

async function updateJSONFile() {
  const filePath = path.join(
    process.cwd(),
    'src',
    'data',
    'woocommerce-shipping-data',
    'shipping-data.json'
  )

  console.log('1. FILEPATH', filePath)

  const { data: zonesData } = await wooCommerceAPI.get('shipping/zones')

  console.log('2. ZONESDATA', zonesData)

  const zonesDataFiltered = zonesData.map(async zone => {
    const { data: postcodesData } = await wooCommerceAPI.get(`shipping/zones/${zone.id}/locations`)
    const { data: shippingMethods } = await wooCommerceAPI.get(`shipping/zones/${zone.id}/methods`)

    const enabledShippingMethods = shippingMethods.filter(shippingMethod => {
      return shippingMethod.enabled === true
    })

    const filteredShippingMethods = enabledShippingMethods.map(shippingMethod => {
      const inputLabelFormat = shippingMethod.title.replace(/ /g, '-')
      console.log('shippingMethod', shippingMethod)

      return {
        id: shippingMethod.id,
        methodId: shippingMethod.method_id,
        methodTitle: shippingMethod.method_title,
        total: {
          ...shippingMethod.settings.cost,
          value: shippingMethod.settings?.cost?.value ?? 0
        },
        freeShipping: shippingMethod.method_id === 'free_shipping',
        flatRate: shippingMethod.method_id === 'flat_rate',
        title: shippingMethod.title,
        inputLabel: inputLabelFormat,
        minAmount: {
          label: shippingMethod.settings?.min_amount?.label ?? '',
          amount: shippingMethod.settings?.min_amount?.value ?? 0
        }
      }
    })

    const postcodes = postcodesData.map(postcode => {
      return postcode.code
    })

    return {
      ...zone,
      postcodes,
      shippingMethods: filteredShippingMethods
    }
  })

  console.log('3. ZONESDATAFILTERED', zonesDataFiltered)

  const zones = await Promise.all(zonesDataFiltered)

  console.log('4. ZONESDATAFILTEREDRESOLVED', zones)

  const filteredZones = zones.filter(zone => {
    return (
      zone.postcodes.length > 0 &&
      zone.postcodes.find(postcode => {
        return postcode !== 'AU'
      })
    )
  })

  const australiaZone = zones.find(zone => {
    return zone.postcodes.find(postcode => {
      return postcode === 'AU'
    })
  })

  const dataToWrite = {
    zones: filteredZones,
    australia: australiaZone
  }

  console.log('5. FILTEREDZONES', dataToWrite)

  // Write a new JSON file for every change in the shipping zones inside WooCommerce
  fs.writeFileSync(filePath, JSON.stringify(dataToWrite, null, 2))
}
