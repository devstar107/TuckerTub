import type { Slider } from '~/types'
import { BackgroundWrap, ButtonWithArrow, Cursive, GradientWrap, Wrapper } from '~/ui'
import { ButtonForCarousel } from '~/ui/button-for-carousel'

interface SliderCardProps {
  sliderData: Slider
  isHeroSlider?: boolean
  isActiveSlide?: boolean
}

export const SliderCard = ({ sliderData, isHeroSlider, isActiveSlide }: SliderCardProps) => {
  const { id, title, subtitle, buttonLink, buttonText } = sliderData
  return (
    <BackgroundWrap
      className={`${isHeroSlider ? 'embla__slide__hero' : 'embla__slide'} 
      ${isActiveSlide ? 'is-active-slide' : ''} 
      sliderhome h-full w-full bg-colorSixteen bg-cover bg-right bg-no-repeat`}
    >
      <div className="flex justify-end h-full w-full lg:mt-[-40px]">
        <img src={`/assets/images/slider/slide-${id}.jpg`} className="embla__img lg:w-4/5 md:w-5/6" />
      </div>
      <GradientWrap className="flex h-full absolute top-0 left-0 justify-start from-colorSixteen  via-colorSixteen/50 to-transparent md:w-[90%]  md:via-colorSixteen lg:w-[73%] lg:via-colorSixteen">
        <div className="m-10 flex w-[80%] flex-col text-left md:m-24 lg:m-32 xl:w-[50%]">
          <p className="font-tucker-tub text-title font-bold uppercase text-colorFifteen lg:text-sliderTitle">
            {title}
          </p>
          <Cursive className="text-sliderTitle  text-colorEight md:text-header lg:text-bigHeader">
            {subtitle}
          </Cursive>
          <div className="h-full w-full py-8 lg:py-10">
            <ButtonForCarousel
              // change background oclor
              href={buttonLink}
              className="w-[300px] bg-colorFourteen hover:bg-colorTen lg:w-[323px]"
            >
              {buttonText}
            </ButtonForCarousel>
          </div>
        </div>
      </GradientWrap>
    </BackgroundWrap>
  )
}
