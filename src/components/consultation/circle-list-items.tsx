import { CircleList } from '~/ui/circle-list'
import { ListWrapper } from '~/ui/list-wrapper'

export const CircleListItems = () => {
  return (
    <div className="h-full w-full space-y-3.5">
      <ListWrapper>
        <CircleList className="bg-colorFourteen">
          <p className="flex justify-center text-center text-lg font-bold text-colorFifteen">1</p>
        </CircleList>
        <p className="text-lg lg:text-list">Book a free consultation with our pet nutritionists</p>
      </ListWrapper>
      <ListWrapper>
        <CircleList className="bg-colorFourteen">
          <p className="flex justify-center text-center text-lg font-bold text-colorFifteen">2</p>
        </CircleList>
        <p className="text-lg lg:text-list">Order food online in the Tucker Tub shop</p>
      </ListWrapper>
      <ListWrapper>
        <CircleList className="bg-colorFourteen">
          <p className="flex justify-center text-center text-lg font-bold text-colorFifteen">3</p>
        </CircleList>
        <p className="text-lg lg:text-list">Delivered fresh to your door</p>
      </ListWrapper>
    </div>
  )
}
