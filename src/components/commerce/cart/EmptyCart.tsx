import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { useCart } from '~/context'
import { ButtonWithArrow } from '~/ui'

export const EmptyCart = props => {
  const router = useRouter()
  const { closeCartModal } = useCart()
  const { isCartComponent } = props

  const isShop = router.asPath.includes('shop')

  if (isCartComponent) {
    return (
      <section className="grid">
        <div className="max-w-[440px]">
          <p className="text-md font-semibold text-colorFourteen">
            No tucker! Keep shopping to add products to your bag.
          </p>
          <div className="py-10">
            <ButtonWithArrow
              className="w-full"
              href={isShop ? undefined : '/shop'}
              fullWidth
              onClick={
                isShop
                  ? () => {
                      return closeCartModal()
                    }
                  : undefined
              }
              buttonType="button"
              buttonVariant="fourth"
            >
              Continue Shopping
            </ButtonWithArrow>
          </div>
          <p className="text-base text-colorEight">
            Need help selecting the right food for your dog? Book your{' '}
            <NextLink href="/consultation" className="text-colorTen underline">
              complimentary consultation
            </NextLink>{' '}
            with our team.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-20 lg:grid-cols-2">
      <div className="max-w-[440px]">
        <p className="text-md font-semibold text-colorFourteen">
          No tucker! Keep shopping to add products to your bag.
        </p>
        <p className="pt-14 text-base text-colorEight">
          Need help selecting the right food for your dog? Book your{' '}
          <NextLink href="/consultation" className="text-colorTen underline">
            complimentary consultation
          </NextLink>{' '}
          with our team.
        </p>
      </div>
      <div className="max-w-[440px]">
        <ButtonWithArrow
          className="w-full"
          href={isShop ? undefined : '/shop'}
          fullWidth
          onClick={
            isShop
              ? () => {
                  return closeCartModal()
                }
              : undefined
          }
          buttonType="button"
          buttonVariant="fourth"
        >
          Continue Shopping
        </ButtonWithArrow>
      </div>
    </section>
  )
}
