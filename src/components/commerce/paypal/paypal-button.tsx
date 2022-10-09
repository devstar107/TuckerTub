import { useEffect } from 'react'

import type { PayPalButtonsComponentProps } from '@paypal/react-paypal-js'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'

import { useOrder } from '~/context'
import { usePaypal } from '~/hooks'

const style: PayPalButtonsComponentProps['style'] = {
  layout: 'vertical',
  color: 'blue',
  shape: 'rect',
  label: 'paypal',
  tagline: false
}

const showSpinner = true

interface PaypalButtonProps {
  fundingSource: PayPalButtonsComponentProps['fundingSource']
}

// Custom component to wrap the PayPalButtons
export default function PaypalButton(props: PaypalButtonProps) {
  const { fundingSource } = props
  const { order } = useOrder()
  const {
    handlePaypalCreateOrder,
    handleOnCancel,
    handleOnError,
    handleOnShippingChange,
    handleOnApprove
  } = usePaypal()
  const amount = order.total

  const [{ options, isPending, isInitial, isResolved, isRejected }, dispatch] =
    usePayPalScriptReducer()
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options
      }
    })
  }, [showSpinner])

  console.log('ispending', isPending)
  console.log('isinitial', isInitial)
  console.log('isresolved', isResolved)
  console.log('isrejected', isRejected)

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, options.currency, style]}
        fundingSource={fundingSource}
        onCancel={handleOnCancel}
        onError={err => {
          return handleOnError(err)
        }}
        onShippingChange={handleOnShippingChange}
        createOrder={(data, actions) => {
          return handlePaypalCreateOrder(data, actions)
        }}
        onApprove={handleOnApprove}
      />
    </>
  )
}
