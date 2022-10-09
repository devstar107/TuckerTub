import { useMemo, useRef, useEffect, useCallback } from 'react'

import { XCircleIcon } from '@heroicons/react/solid'
import Fuse from 'fuse.js'

import { LoadingSpinner } from '~/components/common/icons'
import { SearchIcon } from '~/components/common/icons/SearchIcon'
import { useSearch } from '~/context'
import { Wrapper } from '~/ui'

interface RenderSearchIconProps {
  searchText: string
  handleResetSearch: () => void
}

const RenderSearchIcon = (props: RenderSearchIconProps) => {
  const { searchText, handleResetSearch } = props
  const { searchLoaded } = useSearch()

  if (!searchLoaded) {
    return (
      <button
        className="absolute top-1/2 right-0 flex h-full -translate-y-1/2 items-center justify-center p-[12px]"
        type="button"
        onClick={handleResetSearch}
      >
        <LoadingSpinner className="h-6 w-6" />
      </button>
    )
  }

  if (searchText.length > 1) {
    return (
      <button
        className="absolute top-1/2 right-0 flex h-full -translate-y-1/2 items-center justify-center p-[12px]"
        type="button"
        onClick={handleResetSearch}
      >
        <XCircleIcon className="h-6 w-6 fill-colorFour" />
      </button>
    )
  }

  return null
}

export const Search = (props: any) => {
  const { products, articles = [] } = props
  const {
    searchQuery,
    handleSearchChange,
    handleFilteredProducts,
    handleFilteredArticles,
    handleClearSearch
  } = useSearch()
  const searchRef = useRef<HTMLInputElement>(null)

  const handleResetSearch = useCallback(() => {
    handleClearSearch()
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  const fuse = useMemo(() => {
    const items = [...products, ...articles]

    return new Fuse(items, {
      keys: ['title.rendered', 'name'],
      includeScore: true,
      includeMatches: true,
      isCaseSensitive: false,
      threshold: 0.3
    })
  }, [products, articles])

  const searchResults = fuse.search(searchQuery)

  // This ternary operator is extremely useful. By default, fuse will not display anything. But if we have not put in any string, then we will just get the ordinary data. Otherwise, if we have searched for something, we display the fuse results.
  const finalResult = searchQuery
    ? searchResults.map(result => {
        return result.item
      })
    : []

  useEffect(() => {
    handleFilteredProducts(finalResult)
    handleFilteredArticles(finalResult)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  return (
    <div className="sticky top-0 z-20 m-auto w-full bg-colorFifteen ">
      <div className="relative m-auto w-[70%] py-3">
        <SearchIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <input
          type="text"
          ref={searchRef}
          placeholder="Search for products or advice..."
          className="h-[44px] w-full rounded-lg border border-none border-gray-300 py-2 pl-10 text-lg font-bold text-gray-700 placeholder:text-lg placeholder:font-normal"
          style={{
            boxShadow: 'none'
          }}
          onChange={handleSearchChange}
          value={searchQuery}
        />
        <RenderSearchIcon searchText={searchQuery} handleResetSearch={handleResetSearch} />
      </div>
    </div>
  )
}
