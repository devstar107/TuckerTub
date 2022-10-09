import { useCallback, useEffect, useState } from 'react'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import type { Slider } from '~/types'

import { CurveBanner } from '../../../ui'
import { CurveSlider } from '../../../ui/curveSlider'
import { SliderCard } from '../slider/slider-card'
import { DotButton } from './embla-components/dot-button'

interface EmblaCarouselProps {
  sliderData: Slider[]
  gridAutoColumnPercentage?: number
}

export const EmblaCarousel = (props: EmblaCarouselProps) => {
  const { sliderData, gridAutoColumnPercentage } = props
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, skipSnaps: true, direction: 'ltr', startIndex: 1 },
    [Autoplay()]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const scrollTo = useCallback(
    index => {
      return embla && embla.scrollTo(index)
    },
    [embla]
  )

  const onSelect = useCallback(() => {
    if (!embla) {
      return
    }

    setSelectedIndex(embla.selectedScrollSnap())

    // resume autoplay
    embla.reInit()
  }, [embla, setSelectedIndex])

  useEffect(() => {
    if (!embla) {
      return
    }
    onSelect()
    setScrollSnaps(embla.scrollSnapList())
    embla.on('select', onSelect)
  }, [embla, setScrollSnaps, onSelect])

  return (
    <CurveSlider>
      <div className="embla h-full w-full" ref={emblaRef}>
        <div
          className="embla__container h-full"
          style={{
            transition:'1s',
            gridAutoColumns:
              gridAutoColumnPercentage ??
              '100%' /* Each slide covers user input or 100% of the viewport */
          }}
        >
          {sliderData.map((slide, index) => {
            const isActiveSlide = index === selectedIndex
            return (
              <SliderCard
                key={slide.id}
                sliderData={slide}
                isHeroSlider
                isActiveSlide={isActiveSlide}
              />
            )
          })}
        </div>
        <div className="embla__dots py-8">
          {scrollSnaps.map((_, index) => {
            return (
              <DotButton
                key={index}
                selected={index === selectedIndex}
                onClick={() => {
                  return scrollTo(index)
                }}
              />
            )
          })}
        </div>
      </div>
    </CurveSlider>
  )
}
