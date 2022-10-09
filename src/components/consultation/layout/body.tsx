import Image from 'next/image'

import { Wrapper, GradientWrap, ButtonWithArrow, TextBold, Title, Text } from '~/ui'

import { Calendar } from '../calendar'

export const BodyContent = () => {
  return (
    <GradientWrap className="h-auto w-full bg-colorTwelve pt-0 font-haboro-soft text-colorFourteen lg:pt-20">
      <Wrapper>
        <div className="grid grid-cols-1 gap-10  lg:grid-cols-2">
          <div className="h-fit w-full rounded-lg p-8 font-haboro-soft shadow-consultation ">
            <div className="py-3">
              <Image
                src="/assets/icons/Consultation-Clock.svg"
                alt="Clock"
                width="50px"
                height="50px"
              />
            </div>
            <div className="space-y-2">
              <Title>Book a Free Consultation</Title>
              <TextBold className="py-4">Tucker Tub Consultation - 30 mins</TextBold>
              <Text>
                Book your free consultation at a time that suits you best. A member of our team will
                call you at your selected time to understand your dog and discuss a feeding plan.
                You're one woof away from a healthier, happier pup!
              </Text>
            </div>
          </div>
          <Calendar />
        </div>
        <div className="m-auto grid w-[90%] grid-cols-1 gap-8 py-16 text-center text-base text-colorFourteen sm:grid-cols-2 lg:w-[60%]">
          <div className="flex justify-center">
            <p className="text-lg font-bold">
              Already know what your dog needs? <br />
              Head to the shop to find our range of natural dog food.
            </p>
          </div>
          <div className="m-auto w-[100%]">
            <ButtonWithArrow
              href="/shop"
              buttonVariant="primary"
              center
              className="m-auto w-[100%] lg:max-w-[240px]"
            >
              Shop Dog Food
            </ButtonWithArrow>
          </div>
        </div>
      </Wrapper>
    </GradientWrap>
  )
}
