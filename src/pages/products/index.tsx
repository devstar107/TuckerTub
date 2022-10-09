import { LottieBadges } from '~/components/commerce/lottie-badges'
import { wooCommerceAPI } from '~/lib/WooCommerce'
import type { ProductProps } from '~/types'

const Products = (props: ProductProps) => {
  const { products } = props
  console.log('Products props', products)
  return (
    <div>
      <h1>Products</h1>
      <LottieBadges />
    </div>
  )
}

export default Products

export async function getStaticProps() {
  const { data } = await wooCommerceAPI.get('products')
  return {
    props: {
      products: data
    }
  }
}
