/* eslint-disable @next/next/no-img-element */
import NextImage from 'next/future/image'

import {
  BackgroundWrap,
  GradientWrap,
  Wrapper,
  Cursive,
  HeroText,
  TextBold,
  CurveBanner
} from '~/ui'

import { CursiveBasic } from '../../ui/cursive-basic'
import { CurveArticle } from '../../ui/curveArticle'
import { CurveSlider } from '../../ui/curveSlider'
import { BlockTips } from '../common/homepage/block_tips'

interface NutritionArticleProps {
  article: any
}

export const NutritionArticle = (props: NutritionArticleProps) => {
  const { article } = props
  // console.log('Article', article)
  return (
    <div className="bg-colorFifteen">
      <CurveArticle className="h-full w-full">
        <BackgroundWrap
          className="sliderimg bg-colorSixteen"
          style={{
            backgroundImage: `url(${
              article?.featuredMedia || '/assets/images/product-image-placeholder.svg'
            })`
          }}
        >
          <GradientWrap className="flex h-full justify-start from-colorSixteen via-colorSixteen/80 to-transparent md:w-[80%] lg:w-[70%] lg:via-colorSixteen">
            <div className="m-auto w-[80%]">
              <Cursive className="text-colorEight">Nutrition Advice</Cursive>
              <HeroText className="font-tucker-tub text-xl font-bold uppercase text-colorFifteen lg:text-sliderTitle">
                {article.title.rendered}
              </HeroText>
            </div>
          </GradientWrap>
        </BackgroundWrap>
      </CurveArticle>
      <Wrapper>
        <div className="block space-y-10 pt-16 pb-10 lg:flex lg:space-x-10 lg:space-y-0">
          <div className="text-colorFourteen">
            <div
              className="prose-lg"
              dangerouslySetInnerHTML={{
                __html: article.content.rendered
              }}
            />
          </div>
          <div className="block h-full w-full min-w-[300px] space-y-4 rounded-lg bg-colorSixteen/20 py-8 px-5">
            <NextImage
              src={
                article._embedded?.author?.[0].avatar_urls?.['96'] ??
                '/assets/images/product-image-placeholder.svg'
              }
              alt="Profile"
              width={96}
              height={96}
              className="h-[160px] w-[160px] rounded-full"
            />
            <TextBold className="text-colorFourteen">
              {article._embedded?.author?.[0]?.name}
            </TextBold>
            <p className="text-base text-colorEight">
              {article._embedded?.author?.[0]?.description}
            </p>
          </div>
        </div>
      </Wrapper>
    </div>
  )
}
