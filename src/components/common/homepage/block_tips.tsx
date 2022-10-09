import { ButtonWithArrow, Cursive, GradientWrap, Text, Title, Wrapper } from '~/ui'

import { CursiveBasic } from '~/ui/cursive-basic'
import { EmblaCarouselTips } from '../carousel/slider-tips'

interface BlockTipsProps {
  articles: any
}

export const BlockTips = ({ articles }: BlockTipsProps) => {
  return (
    <GradientWrap className="bg-split-bg py-20">
      <Wrapper>
        <div className="grid grid-cols-1 text-left sm:grid-cols-[2fr_1fr]">
          <Title className="col-span-full text-colorFourteen">Tips for Pup Parents</Title>
          <div>
            <CursiveBasic>Resources from our team of canine experts </CursiveBasic>
            <Text className="text-colorFourteen">
              Ready to be the best pet parent ever? Get expert advice on all things a healthy dog
              would need, from a balanced diet to caring for your best furry friend.
            </Text>
          </div>
          <div className="py-10">
            <ButtonWithArrow center href="/nutrition" className="w-[310px] lg:w-[240px]">
              Nutrition Advice
            </ButtonWithArrow>
          </div>
        </div>
      </Wrapper>
      <div className="h-full w-full pt-8">
        {articles && articles.length > 0 ? (
          <EmblaCarouselTips sliderData={articles} />
        ) : (
          <div className="text-center">
            <Title className="pt-6 text-colorFourteen">No articles found</Title>
          </div>
        )}
      </div>
    </GradientWrap>
  )
}
