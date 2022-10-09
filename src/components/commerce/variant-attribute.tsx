interface VariantAttributeProps {
  option: string
  selectedVariant: any
  handleSelectedVariant: (variantOption: string) => void
  isAvailable: any
}

export const VariantAttribute = (props: VariantAttributeProps) => {
  const { option, handleSelectedVariant, selectedVariant, isAvailable } = props

  const selectedVariantIsOption = selectedVariant?.attributes?.find(attribute => {
    return attribute.option === option
  })

  // fontWeight and borderWidth will cause the content to move, be aware of that.

  let borderColorStyle = ''

  if (!selectedVariantIsOption) {
    borderColorStyle = 'rgba(99, 88, 94, 1)'
  }

  if (selectedVariantIsOption) {
    borderColorStyle = 'rgba(1, 64, 50, 1)'
  }

  if (!isAvailable) {
    borderColorStyle = 'rgba(178, 169, 174, 1)'
  }

  return (
    <button
      className={`min-w-[80px] rounded-lg py-2 px-5 ${!isAvailable ? 'out-of-stock-variant' : ''}`}
      style={{
        borderColor: borderColorStyle,
        borderWidth: '2px',
        fontWeight: 400,
        textShadow: selectedVariantIsOption ? '0px 0px 1px black' : 'none',
        backgroundColor: selectedVariantIsOption ? 'rgba(212, 237, 216, 0.5)' : 'transparent'
      }}
      type="button"
      onClick={() => {
        handleSelectedVariant(option)
      }}
    >
      {option}
    </button>
  )
}
