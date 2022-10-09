import { useShopFilter } from '~/context'

export const ClearFilters = () => {
  const { handleClearFilters } = useShopFilter()
  return (
    <button
      type="button"
      onClick={() => {
        console.log('Clearing filters')
        handleClearFilters()
      }}
      className="text-left text-base underline text-colorEight"
    >
      Clear Filters
    </button>
  )
}
