import { CurveBanner, Header, Title, Wrapper, HeroText } from '~/ui'
import { CursiveBasic } from '~/ui/cursive-basic'

import { Consultation } from '../ourDifference/bookconsultation'
import { JoinTeam } from './join'
import { TeamCard } from './team-card'

export const OurTeamContent = props => {
  const { teamData } = props
  return (
    <div className="h-full w-full bg-colorFourteen">
      <CurveBanner>
        <Header className="m-auto w-[80%] text-colorFourteen">Our Team</Header>
      </CurveBanner>
      <Wrapper>
        <div className="h-[200px]" />
        <div className="py-20">
          <Title className="text-colorFifteen">Tucker Tub Distributors</Title>
          <CursiveBasic className="text-blockHeader text-colorSixteen">
            Local dog experts delivering to your door
          </CursiveBasic>
          <div className="py-5 font-haboro-soft text-colorFifteen">
            <HeroText>
              Our Tucker Tub team of distributors services regional Victoria, where it all started
              from. The passionate crew has a weekly delivery schedule, delivering direct to your
              door. They are a helpful bunch and enjoy seeing all of their loyal customers, and
              their favourite doggos! Your local distributor is happy to help with feeding advice
              and recommendations to keep your pup healthy.
            </HeroText>
          </div>
        </div>
      </Wrapper>
      <section className="grid grid-cols-1 gap-y-28 gap-x-8 px-8 py-20 md:grid-cols-2 xl:grid-cols-3">
        {teamData.map(person => {
          return <TeamCard data={person} key={person.node.id} />
        })}
        <JoinTeam />
      </section>
    </div>
  )
}
