/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/extensions */

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

import { Failure } from '~/components/commerce/confirmation/failure'
import { Success } from '~/components/commerce/confirmation/success'
import { PageContainer } from '~/ui'

export default function ThankYou(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { stripeCheckoutData, wooCommerceOrderData, paypalOrderData } = props

  console.log('Confirmation - Stripe Order', stripeCheckoutData)
  console.log('Confirmation - WooCommerce Order', wooCommerceOrderData)
  console.log('Confirmation - PayPal Order', paypalOrderData)

  const isStripe = stripeCheckoutData?.status

  if (
    isStripe ? stripeCheckoutData?.status !== 'succeeded' : paypalOrderData?.status !== 'COMPLETED'
  ) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <NextSeo
          title="Confirmation | Failure | Tucker Tub"
          description="Confirmation | Failure Description"
          openGraph={{
            title: 'Confirmation | Failure | Tucker Tub',
            description: 'Confirmation | Failure Description',
            url: process.env.NEXT_PUBLIC_FRONTEND_URL,
            type: 'website',
            locale: 'en_AU',
            site_name: 'Tucker Tub'
          }}
        />
        <PageContainer>
          <Failure
            stripeCheckoutData={stripeCheckoutData}
            wooCommerceOrderData={wooCommerceOrderData}
            paypalOrderData={paypalOrderData}
          />
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <NextSeo
        title="Confirmation | Success | Tucker Tub"
        description="Confirmation | Success Description"
        openGraph={{
          title: 'Confirmation | Success | Tucker Tub',
          description: 'Confirmation | Success Description',
          url: process.env.NEXT_PUBLIC_FRONTEND_URL,
          type: 'website',
          locale: 'en_AU',
          site_name: 'Tucker Tub'
        }}
      />
      <PageContainer>
        <Success
          stripeCheckoutData={stripeCheckoutData}
          wooCommerceOrderData={wooCommerceOrderData}
          paypalOrderData={paypalOrderData}
        />
      </PageContainer>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // If we do not have a sessionId - meaning that the user most likely went to this page by their own, then redirect them to the homepage

  const { result, payment_intent, paypalOrderId, paymentIntentId } = context.query

  console.log('CONTEXT QUERY', context.query)

  const truthyQuery = Object.keys(context.query).some(key => {
    return context.query[key] !== undefined
  })

  if (!truthyQuery) {
    console.log('Redirecting')
    console.log('result', result)
    console.log('paypalOrderId', paypalOrderId)

    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  if (paypalOrderId) {
    const paypalOrderResponse = await fetch(
      `${process.env.FRONTEND_URL}/api/commerce/paypal/retrieve-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: paypalOrderId
        })
      }
    )

    const paypalOrderData = await paypalOrderResponse.json()

    console.log('paypalOrderDataCONFIRMATION', paypalOrderData)

    const orderIdFromPaypalMetadata = paypalOrderData.purchase_units.find(item => {
      return item.custom_id
    })

    console.log('orderIdFromPaypalMetadata', orderIdFromPaypalMetadata)

    const retrievedWooCommerceOrderResponse = await fetch(
      `${process.env.FRONTEND_URL}/api/commerce/orders/get-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderIdFromPaypalMetadata.custom_id
        })
      }
    )

    const retrievedWooCommerceOrderData = await retrievedWooCommerceOrderResponse.json()

    console.log('retrievedWOO', retrievedWooCommerceOrderData)

    return {
      props: {
        paypalOrderData,
        wooCommerceOrderData: retrievedWooCommerceOrderData
      }
    }
  }

  // NOT PAYPAL ORDER, PROCEED WITH STRIPE

  console.log('CONFIRMATION-ApplePaypaymentIntentId', paymentIntentId)

  // this checks that the payment has been completed on the stripe side
  const retrievedStripePaymentIntentResponse = await fetch(
    `${process.env.FRONTEND_URL}/api/commerce/stripe/retrieve-payment-intent?id=${
      result || payment_intent || paymentIntentId
    }`,
    {
      method: 'POST'
    }
  )
  const retrievedStripePaymentIntentData = await retrievedStripePaymentIntentResponse.json()

  console.log('retrievedStripePaymentIntentData', retrievedStripePaymentIntentData)

  const orderIdFromStripeMetadata = retrievedStripePaymentIntentData.metadata.orderId

  // if data has an object containing error - simply don't display the page and instead redirect to the homepage

  if (retrievedStripePaymentIntentData.error) {
    console.log('Invalid stripe session, redirecting to homepage')
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // gets the order from WooCommerce to get the order number and so on

  console.log('orderIdFromStripeMetadata', orderIdFromStripeMetadata)

  const retrievedWooCommerceOrderResponse = await fetch(
    `${process.env.FRONTEND_URL}/api/commerce/orders/get-order`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderIdFromStripeMetadata
      })
    }
  )
  const retrievedWooCommerceOrderData = await retrievedWooCommerceOrderResponse.json()

  // if data has an object containing error - simply don't display the page and instead redirect to the homepage

  // if (retrievedWooCommerceOrderData.error) {
  //   console.log('Invalid wooCommerce order, redirecting to homepage')
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false
  //     }
  //   }
  // }

  return {
    props: {
      stripeCheckoutData: retrievedStripePaymentIntentData,
      wooCommerceOrderData: retrievedWooCommerceOrderData
    }
  }
}
