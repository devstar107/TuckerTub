import NextLink from 'next/link'

import { BookIcon } from '~/components/common/icons/GreenBook'
import { DogIcon } from '~/components/common/icons/GreenDog'
import { TeamIcon } from '~/components/common/icons/GreenTeam'
import { LinkOurDifference } from '~/components/ourStory/link-ourdifference'
import type { IInfoCard } from '~/types'
import { GradientWrap, Wrapper, InfoCard } from '~/ui'

function OurTeamDescription() {
  return (
    <div>
      <p>
        Made locally in country Victoria, it takes a hard working crew to make and deliver only the
        best all natural dog food available. We also have a passionate team of regional{' '}
        <NextLink href="/our-team" className="font-medium underline">
          distributors
        </NextLink>{' '}
        delivering right to your door.
      </p>
    </div>
  )
}

const BodyContentInfoCardData: IInfoCard[] = [
  {
    id: '1',
    heading: 'Our History',
    subheading:
      'Tucker Tub knows dogs, with more than 25 years of experience making natural dog food.',
    description: `Tucker Tub was founded in 1996 in Broadford, Victoria, when the Spiteri family, Rudi, Loree and
    Richard, realised the lack of unprocessed food options for their pack of Kelpies. Since
    then we've never looked back.`,
    icon: <BookIcon />
  },
  {
    id: '2',
    heading: 'Our Mission',
    subheading: "Healthy pups and happy pet parents - that's what drives us.",
    description: `Tucker Tub is on a mission to improve the health of millions of Aussie dogs by producing honest all natural dog food made farm fresh in Australia.`,
    icon: <DogIcon />
  },
  {
    id: '3',
    heading: 'Our Team',
    subheading: "We're a dedicated team of nutritionists, cooks and all out dog lovers.",
    description: <OurTeamDescription />,
    icon: <TeamIcon />
  }
]

export const BodyContent = () => {
  return (
    <div className="h-full w-full bg-colorFourteen py-20 font-haboro-soft text-colorFifteen">
      <Wrapper>
        <div className="m-auto grid grid-cols-1 gap-[30px] sm:grid-cols-2">
          {BodyContentInfoCardData.map(card => {
            return <InfoCard key={card.id} cardData={card} />
          })}
          <LinkOurDifference />
        </div>
      </Wrapper>
    </div>
  )
}
