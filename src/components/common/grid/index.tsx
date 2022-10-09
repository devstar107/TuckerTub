/* eslint-disable react/jsx-no-useless-fragment */
import type { ComponentType } from 'react'
import { useState } from 'react'

import { ViewMore } from '~/components/common'
import { Title } from '~/ui'

type ComponentTypeData<T> = ComponentType<T> & {
  data: T[]
}

interface GridItemsProps<T extends { id?: string }> {
  slicedData: T[]
  data: T[]
  cardComponent: ComponentTypeData<any>
}

export const GridItems = <T extends { id?: string }>({
  slicedData,
  data,
  cardComponent: CardComponent
}: GridItemsProps<T>) => {
  const [isViewMoreClicked, setIsViewMoreClicked] = useState(false)

  const isProductCard = CardComponent.displayName === 'ProductCard'
  const dataToMap = isViewMoreClicked ? data : slicedData

  const CardLayout = isProductCard ? (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {dataToMap.map(d => {
        return <CardComponent key={d.id} data={d} categoryHandle={d.categories[0].slug} />
      })}
    </section>
  ) : (
    <section className="grid grid-cols-1 gap-8 rounded-b-lg px-8 md:grid-cols-3">
      {dataToMap.map(d => {
        return <CardComponent key={d.id} data={d} />
      })}
    </section>
  )

  function handleViewMoreClick() {
    setIsViewMoreClicked(true)
  }

  if (!data.length) {
    return (
      <div className="text-center">
        <Title className="text-colorFourteen">No data found</Title>
      </div>
    )
  }

  if (isViewMoreClicked) {
    return <>{CardLayout}</>
  }

  return (
    <div>
      {CardLayout}
      <div className="py-[60px]">
        {isProductCard && data.length > 3 ? (
          <ViewMore
            handleViewMoreClick={handleViewMoreClick}
            dataLength={data.length}
            maxItemsLength={slicedData.length}
            buttonVariant="primary"
          />
        ) : (
          data.length > 5 && (
            <ViewMore
              handleViewMoreClick={handleViewMoreClick}
              dataLength={data.length}
              maxItemsLength={slicedData.length}
              buttonVariant="tertiary"
            />
          )
        )}
      </div>
    </div>
  )
}
