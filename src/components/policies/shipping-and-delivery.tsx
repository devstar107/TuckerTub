import { Title, Wrapper } from '~/ui'

export const ShippingAndDeliveryContent = () => {
  return (
    <div className="preflight-escape h-full bg-colorFifteen py-12">
      <Wrapper>
        <Title className="text-colorFourteen">Shipping and Delivery</Title>
        <div className="md:[80%] text-colorFourteen sm:w-full lg:w-[80%]">
          <h3>Deliveries</h3>

          <p>
            For standard orders we charge a flat rate of $8.95 inc GST. Shipping is free on all
            orders of $80 or more.
          </p>
          <p>
            We are currently only delivering our fresh product range within Melbourne metro area and
            select regional areas in Victoria. National delivery is coming soon, please check back
            shortly. Available delivery options will update in the cart. If you need help with a
            delivery to your area, please contact us.
          </p>
          <p>
            We may not deliver to all locations and available shipping options will update once you
            enter your postcode in the Checkout.
          </p>
          <p>
            Products will be delivered by a third-party courier or Tucker Tub Distributor. Our
            deliveries exclude PO boxes. We cannot be responsible for product handled incorrectly.
            You don't have to be home to receive delivery, your order will be left for you according
            to your delivery instructions.
          </p>
          <h3>Damages, returns, and issues</h3>
          <p>
            Please inspect your order upon receipt and contact us immediately if any items are
            spoiled, damaged, missing, or incorrect, and we will evaluate the issue and rectify it.
            Our products are perishable and once received you must take all necessary steps to
            ensure products are handled and stored according to our recommendations and we are not
            responsible for product handled incorrectly upon receipt.
          </p>
          <p>
            For any issues with delivery, please contact us immediately on{' '}
            <a href="mailto:woof@tuckertub.com.au" className="font-medium underline">
              woof@tuckertub.com.au
            </a>{' '}
            or over the phone.
          </p>
          <p>Due to the perishable nature of our product, we cannot accept returns.</p>
          <h3>Refunds</h3>
          <p>
            We will notify you once we've evaluated your request and let you know if the refund was
            approved or not. If approved, you'll be automatically refunded through your original
            payment method.
          </p>
        </div>
      </Wrapper>
    </div>
  )
}
