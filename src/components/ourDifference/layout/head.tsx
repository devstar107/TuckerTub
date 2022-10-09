import type { IChecklist } from '~/types'
import {
  Cursive,
  CurveBanner,
  Header,
  Title,
  Wrapper,
  HeroText,
  BackgroundWrap,
  CheckList,
  GradientWrap
} from '~/ui'

import { CursiveBasic } from '../../../ui/cursive-basic'

const HeadContentCheckListData: IChecklist[] = [
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

export const HeadContent = () => {
  return (
    <BackgroundWrap className="h-full w-full bg-meat">
      <GradientWrap className="from-colorEight via-colorEight to-transparent">
        <CurveBanner>
          <Header className="text-colorFourteen">Our Difference</Header>
        </CurveBanner>
        <Wrapper>
          <div className="h-[200px]" />
          <div className="py-20 w-[100%] lg:w-[90%]">
            <Title className="text-colorFifteen">The Tucker Tub Difference</Title>
            <CursiveBasic>100% real ingredients, no fillers</CursiveBasic>
            <div className="py-[30px] text-colorFifteen">
              <HeroText>
                Big brand pet food manufacturers often use fillers that can be harmful for your
                dog's digestive system. We've been using only the best natural ingredients to make
                nutritious, healthy dog food since 1996. We learnt exactly what dogs need and what
                they love.
              </HeroText>
            </div>
            <div className="space-y-3.5">
              {HeadContentCheckListData.map(item => {
                return <CheckList key={item.id} title={item.title} />
              })}
            </div>
          </div>
        </Wrapper>
      </GradientWrap>
    </BackgroundWrap>
  )
}
