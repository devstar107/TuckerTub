import { ButtonWithArrow } from '~/ui'

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth'

interface ViewMoreProps {
  dataLength: number
  maxItemsLength: number
  handleViewMoreClick: () => void
  buttonVariant?: ButtonVariant
}

export const ViewMore = ({
  dataLength,
  handleViewMoreClick,
  maxItemsLength,
  buttonVariant = 'primary'
}: ViewMoreProps) => {
  return (
    <div className="h-full w-full text-center">
      <ButtonWithArrow onClick={handleViewMoreClick} buttonVariant={buttonVariant} center>
        View {dataLength - maxItemsLength} more
      </ButtonWithArrow>
    </div>
  )
}
