import NextImage from 'next/future/image'

import { formatMoney } from '~/utilities'

interface WooCommerceCartProps {
  wooCommerceOrderData: any
}

export function WooCommerceCart(props: WooCommerceCartProps) {
  const { wooCommerceOrderData } = props

  const shippingCost =
    wooCommerceOrderData.shipping_total === '0.00'
      ? 'FREE'
      : formatMoney(wooCommerceOrderData.shipping_total)

  return (
    <section className="grid max-w-[440px] gap-y-8 pb-14">
      {wooCommerceOrderData.line_items.map(lineItem => {
        const lineItemPrice = Number(lineItem.total) + Number(lineItem.total_tax)
        const formattedLineItemPrice = formatMoney(lineItemPrice)
        return (
          <div
            key={lineItem.id}
            className="grid grid-cols-[2fr_10fr] gap-x-4 text-smallCheckout text-colorSeven"
          >
            <div className="aspect-1 max-w-[100px]">
              <NextImage
                src={lineItem.image?.src ?? '/assets/images/product-image-placeholder.svg'}
                alt={lineItem.image?.alt ?? lineItem.image?.name ?? 'Placeholder'}
                height={256}
                width={256}
                className="h-full w-full rounded-md object-cover object-center"
              />
            </div>
            <section className="text-base">
              <p className="w-[70%] p-0 pb-3 text-base font-bold text-colorFourteen">
                {lineItem.name}
              </p>
              <section className="grid">
                <div className="flex items-center justify-between">
                  <p className="p-0">
                    {lineItem.meta_data?.find(item => {
                      return item.display_key === 'Weight'
                    })?.value ?? 'N/A'}
                  </p>
                  <span className="font-semibold text-colorFourteen">x {lineItem.quantity}</span>
                </div>
                <div className="flex items-center justify-end">
                  <p className="p-0">{formattedLineItemPrice}</p>
                </div>
              </section>
            </section>
          </div>
        )
      })}
      <div className="text-base text-colorFourteen">
        {wooCommerceOrderData.line_items.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>Tax</p>
              <p>{formatMoney(wooCommerceOrderData.total_tax)}</p>
            </div>
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>
                {formatMoney(
                  wooCommerceOrderData.total -
                    wooCommerceOrderData.total_tax -
                    wooCommerceOrderData.shipping_total
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>{shippingCost}</p>
            </div>
            <hr className="my-2 border-t-2 border-black" />
            <div className="flex justify-between">
              <p className="p-0 text-lg font-bold">TOTAL</p>
              <p className="p-0 text-lg font-semibold">{formatMoney(wooCommerceOrderData.total)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
