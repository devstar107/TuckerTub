import type {
  PayPalHostedFieldsComponentProps,
  ReactPayPalScriptOptions
} from '@paypal/react-paypal-js'

const paypalHostedFieldsComponent: PayPalHostedFieldsComponentProps = {
  styles: {
    input: {
      'font-size': '16px',
      'font-family': 'Roboto, Open Sans, Segoe UI, sans-serif',
      'font-weight': '400',
      color: '#5a5a5a',
      border: '1px solid #c2c2c2',
      'border-radius': '4px',
      padding: '12px',
      width: '100%'
    },
    'input--focus': {
      border: '1px solid #00a0e3',
      outline: 'none',
      'box-shadow': '0 0 0 2px rgba(0, 0, 0, 0.1)'
    },
    'input--error': {
      border: '1px solid #e53935',
      outline: 'none',
      'box-shadow': '0 0 0 2px rgba(0, 0, 0, 0.1)'
    },
    'input--disabled': {
      border: '1px solid #c2c2c2',
      background: '#fafafa',
      color: '#5a5a5a',
      cursor: 'not-allowed'
    }
  }
}

const paypalComponents = 'buttons'

export const initialPaypalOptions: ReactPayPalScriptOptions = {
  'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test',
  currency: 'AUD',
  intent: 'capture',
  // 'data-client-token': 'abc123xyz==',
  'data-react-paypal-script-id': 'paypal-button',
  components: paypalComponents
  // debug: process.env.NODE_ENV === 'development'
  // 'buyer-country': 'AU'
}
