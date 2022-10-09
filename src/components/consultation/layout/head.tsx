import {
  Cursive,
  CurveBanner,
  Header,
  Title,
  Wrapper,
  HeroText,
  BackgroundWrap,
  GradientWrap
} from '~/ui'
import { CursiveBasic } from '~/ui/cursive-basic'

import { CircleListItems } from '../circle-list-items'

export const HeadContent = () => {
  return (
    <BackgroundWrap className="sliderimg bg-colorTwelve bg-consultation">
      <GradientWrap className="from-colorTwelve via-colorTwelve to-transparent">
        <CurveBanner>
          <Header className="text-colorFourteen">Consultation</Header>
        </CurveBanner>
        <Wrapper>
          <div className="h-[200px]" />
          <div className="py-20">
            <Title className="text-colorFourteen">Personalised Nutrition</Title>
            <CursiveBasic>Tailored just for your pup</CursiveBasic>
            <div className="pt-5 pb-[30px] text-colorFifteen">
              <HeroText className="text-colorFourteen">
                Just like with humans, each dog's dietary needs is unique. There are tons of feeding
                plan generators and diets based on a dog's size. But so many factors play into your
                pup's optimal meal plan. We're firm believers that the best way to get your dog's
                perfect feeding plan is to hear directly from the experts. That's why we offer free
                consultations with our in-house pet nutritionists.
              </HeroText>
              <br />
              <HeroText className="text-colorFourteen">
                Tucker Tub knows dogs, with over 25 years of experience making natural dog food.
                Over the years, we've learned what works best for them, and we're here to pass that
                knowledge on. Get your pup eating and living healthy in 3 easy steps.
              </HeroText>
            </div>
            <CircleListItems />
          </div>
        </Wrapper>
      </GradientWrap>
    </BackgroundWrap>
  )
}
