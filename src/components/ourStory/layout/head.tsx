import {
  Cursive,
  CurveBanner,
  Header,
  Title,
  Wrapper,
  GradientWrap,
  HeroText,
  BackgroundWrap
} from '~/ui'

import { CursiveBasic } from '~/ui/cursive-basic'

export const HeadContent = () => {
  return (
    <BackgroundWrap className="h-full w-full bg-slide-2">
      <GradientWrap className="from-colorFourteen via-colorFourteen to-transparent">
        <CurveBanner>
          <Header className="text-colorFourteen">Our Story</Header>
        </CurveBanner>
        <Wrapper>
          <div className="h-[200px]" />
          <div className="py-20">
            <Title className="text-colorFifteen">Tucker Tub</Title>
            <CursiveBasic>All natural dog food, made farm fresh</CursiveBasic>
            <div className="pt-8 text-colorFifteen">
              <HeroText>
                At Tucker Tub, dogs are family. We want what's best for them. That's why your pup's
                gut health is so important to us.
              </HeroText>
              <br />
              <HeroText>
                Conventional pet food is full of additives, fillers, and other nutrient-poor
                ingredients. Some are even harmful to your furry friend's digestive system. Tucker
                Tub was created to change the way we feed our dogs.
              </HeroText>
              <br />
              <HeroText>
                We've been crafting dog food using fresh ingredients from local farms in country
                Victoria since our inception over 25 years ago. As one of the pioneers of natural
                dog food in Australia, we understand what's best for different breeds - including
                those with food sensitivities and allergies.
              </HeroText>
              <br />
              <HeroText>
                With Tucker Tub, you can feel confident you're giving your dog nutritious, natural
                food that's best for them. That's puppy love.
              </HeroText>
            </div>
          </div>
        </Wrapper>
      </GradientWrap>
    </BackgroundWrap>
  )
}
