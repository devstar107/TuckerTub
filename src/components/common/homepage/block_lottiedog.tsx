import { LottieBadges } from '~/components/commerce/lottie-badges'
import { ButtonWithArrow, Text, Title, Wrapper } from '~/ui'
import { CursiveBasic } from '~/ui/cursive-basic'

export const BlockPersonalised = () => {
  return (
    <div className="bg-colorFifteen pt-20 pb-12">
      <Wrapper>
        <div className="grid grid-cols-1 text-left sm:grid-cols-[2fr_1fr]">
          <Title className="col-span-full text-colorFourteen">Personalised Nutrition</Title>
          <div>
            <CursiveBasic>Feeding plans tailored just for your pup</CursiveBasic>
            <Text className="text-colorFourteen">
              Take your dog's nutrition one step further with a feeding plan curated by our expert
              pet nutritionists. It's as easy as 1, 2, 3.
            </Text>
          </div>
          <div className="py-10">
            <ButtonWithArrow href="/consultation" center className="w-[310px] lg:w-[240px]">
              Book Consultation
            </ButtonWithArrow>
          </div>
        </div>
        <LottieBadges />
      </Wrapper>
    </div>
  )
}
