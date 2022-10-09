import NextLink from 'next/link'

import { GridItems } from '~/components/common'
import type { ArticleProps } from '~/types'
import { Cursive, CurveBanner, Header, Title, Wrapper, HeroText } from '~/ui'
import { CursiveBasic } from '~/ui/cursive-basic'

import { ArticleCard } from './article-card'

export const NutritionContent = ({ articles }: ArticleProps) => {
  const maxFiveArticles = articles.slice(0, 5)

  return (
    <div className="h-full w-full bg-colorSixteen">
      <CurveBanner>
        <Header className="m-auto w-[80%] text-colorFourteen">Nutrition</Header>
      </CurveBanner>
      <Wrapper>
        <div className="h-[200px]" />
        <div className="py-20">
          <Title className="text-colorFourteen">Tips for Pup Parents</Title>
          <CursiveBasic className=" text-gray-50">
            Resources from our team of canine experts
          </CursiveBasic>
          <div className="py-5 font-haboro-soft text-colorFourteen">
            <HeroText>
              We all want our pups to lead long, healthy lives. That's why we can't ignore their
              nutrition. Gut health plays a vital role in your dog's overall wellbeing, from the
              shine of their coat to their mood. Pups with a balanced diet enjoy a healthier
              microbiome, good digestion, a stronger immune system and other benefits. By being
              mindful about what our pets eat, we can help them live their happiest lives.
            </HeroText>
            <br />
            <HeroText>
              These articles offer feeding guides and nutrition advice, plus the latest findings in
              pet gut health.
            </HeroText>
            <br />
            <HeroText>
              Ready to take your dog parenting skills a step further? Hear directly from the
              experts. Our team has over 25 years of expertise when it comes to dog nutrition. The
              best way to get started on Tucker Tub is to{' '}
              <NextLink href="/consultation" className="font-medium underline">
                book a free consultation
              </NextLink>{' '}
              with our pet nutritionists.
            </HeroText>
          </div>
        </div>
      </Wrapper>
      <GridItems data={articles} slicedData={maxFiveArticles} cardComponent={ArticleCard} />
    </div>
  )
}
