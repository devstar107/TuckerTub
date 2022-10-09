import { AustraliaMapIcon, PawIcon, RedHeartIcon } from '~/components/common/icons'
import type { IChecklist, IInfoCard } from '~/types'
import { Wrapper, GradientWrap, InfoCard, CheckList, Text } from '~/ui'

import { Consultation } from '../bookconsultation'

const InfoCardData: IInfoCard[] = [
  {
    id: '1',
    heading: 'Farm Fresh & Local',
    subheading: 'Australian owned and operated.',
    description: `We go one step further than Aussie made. We source ingredients from local farms in country Victoria that don't use any preservatives or chemicals in their product. It's as fresh as it gets!`,
    icon: <AustraliaMapIcon />
  },
  {
    id: '2',
    heading: 'Crafted With Care',
    subheading: 'Tucker Tub is made with love, backed by expertise.',
    description: `Your pup's health matters to us. Our 25 years of experience is in each recipe, approved by
      seasoned vets and our very own in-house pet nutritionists.`,
    icon: <RedHeartIcon />
  },
  {
    id: '3',
    heading: 'Tailored Just For Them',
    subheading: 'Each dog is unique and so are their dietary needs.',
    description: `There's no other dog quite like yours! We have dedicated specialists and in-house           pet nutritionists to create a tailored meal plan for your pup. We'll help you discover what
      foods they thrive on.`,
    icon: <PawIcon />
  }
]

const CheckListData: IChecklist[] = [
  {
    id: '1',
    title: 'Improved immune system'
  },
  {
    id: '2',
    title: 'Boosted metabolism'
  },
  {
    id: '3',
    title: 'Healthy digestion'
  },
  {
    id: '4',
    title: 'Weight maintenance'
  },
  {
    id: '5',
    title: 'Healthy, shiny coat'
  }
]

export const BodyContent = () => {
  return (
    <div className="h-full w-full bg-colorEight py-20 font-haboro-soft text-colorFifteen">
      <Wrapper>
        <div className="m-auto grid grid-cols-1 gap-[30px]  sm:grid-cols-2">
          <div>
            <Text className="text-title font-bold">Naturally Nutritious</Text>
            <br />
            <Text>Tucker Tub is 100% natural - and so much more…</Text>
            <br />
            <Text>
              We pay special attention to essential ingredients like proteins, vitamins and amino
              acids while keeping out all the additives, preservatives and chemicals.
            </Text>
            <br />
            <Text>You can think of Tucker Tub as superfood for your pup. </Text>
          </div>
          <div className="w-full">
            <p className="text-base">
              Your dog gets the highly-nutritious ingredients it needs which may help provide the
              following benefits:
            </p>
            <div className="space-y-3.5 pt-5">
              {CheckListData.map(item => {
                return <CheckList key={item.id} title={item.title} />
              })}
            </div>
          </div>
          {InfoCardData.map(card => {
            return <InfoCard key={card.id} cardData={card} />
          })}
          <Consultation />
        </div>
      </Wrapper>
    </div>
  )
}
