import type { IChecklist } from '~/types'
import {
  BackgroundWrap,
  ButtonWithArrow,
  CheckList,
  Cursive,
  GradientWrap,
  Text,
  Title,
  Wrapper
} from '~/ui'

import { CursiveBasic } from '../../../ui/cursive-basic'

const BlockDifferenceCheckListData: IChecklist[] = [
  {
    id: '1',
    title: '100% natural ingredients'
  },
  {
    id: '2',
    title: 'No fillers, preservatives or additives'
  },
  {
    id: '3',
    title: 'Rich in vital nutrients '
  },
  {
    id: '4',
    title: 'Reduces need for supplements'
  },
  {
    id: '5',
    title: 'Recommended by vets and pet nutritionists'
  },
  {
    id: '6',
    title: 'Locally sourced, farm fresh'
  },
  {
    id: '7',
    title: 'Premium quality at affordable prices'
  }
]

export const BlockDifference = () => {
  return (
    <BackgroundWrap className="h-full bg-meat ">
      <GradientWrap className="h-full from-colorEight via-colorEight/80 to-transparent">
        <Wrapper className="m-auto w-[80%] py-20">
          <div className="grid grid-cols-1 text-left sm:grid-cols-[2fr_1fr]">
            <Title className="col-span-full text-colorFifteen">The Tucker Tub Difference</Title>
            <div>
              <CursiveBasic>100% real ingredients, no fillers</CursiveBasic>
              <Text className="text-colorFifteen">
                Big brand pet food manufacturers often use fillers that can be harmful for your
                dog's digestive system. We've been using only the best natural ingredients to make
                nutritious, healthy dog food since 1996. We learnt exactly what dogs need and what
                they love.
              </Text>
            </div>
            <div className="py-10">
              <ButtonWithArrow href="/our-difference" center className="w-[310px] lg:w-[240px]">
                Our Difference
              </ButtonWithArrow>
            </div>
          </div>
          <div className="space-y-3.5 pt-5">
            {BlockDifferenceCheckListData.map(item => {
              return <CheckList key={item.id} title={item.title} />
            })}
          </div>
        </Wrapper>
      </GradientWrap>
    </BackgroundWrap>
  )
}
