import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/router'

import { ProductCard } from '~/components/commerce/product-card'
import { useSearch } from '~/context'
import type { ProductProps } from '~/types'
import { ButtonWithArrow } from '~/ui'

import { ProductSearchCard } from '../../../../commerce/product-search'
import { ArticleSearch } from '../../../../nutrition/article-search'

export const RenderSearch = (props: ProductProps) => {
  const { filteredProducts, filteredArticles, searchQuery, searchLoaded } = useSearch()

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const filteredItems = useMemo(() => {
    return [...filteredProducts, ...filteredArticles]
  }, [filteredProducts, filteredArticles])

  useEffect(() => {
    router.events.on('routeChangeStart', () => {
      setIsLoading(true)
    })
    router.events.on('routeChangeComplete', () => {
      setIsLoading(false)
    })

    return () => {
      router.events.off('routeChangeComplete', () => {
        setIsLoading(false)
      })
    }
  }, [router.events])

  if (searchQuery.length === 0) {
    return null
  }

  if (!searchLoaded) {
    return null
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center">
        <p>No results found for query "{searchQuery}"</p>
      </div>
    )
  }
  const maxFourResults = filteredItems.slice(0, 4)
  const maxFourUniqueResults = [...new Set(maxFourResults)]
  return (
    <>
      <div className="grid grid-cols-1 gap-8 overflow-y-auto rounded-b-lg px-8 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {maxFourUniqueResults.map(result => {
          if (result.type === 'post') {
            return <ArticleSearch key={result.id} data={result} />
          }

          return (
            <ProductSearchCard
              key={result.id}
              data={result}
              categoryHandle={result.categories[0].slug!}
            />
          )
        })}
      </div>
      <div className="py-2">
        <ButtonWithArrow
          onClick={() => {
            router.push(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/results?q=${searchQuery}`)
          }}
          center
          buttonVariant="primary"
        >
          {isLoading ? 'Fetching...' : `View all ${filteredProducts.length} results`}
        </ButtonWithArrow>
      </div>
    </>
  )
}
