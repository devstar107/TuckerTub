import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import type { Slider } from '~/types'

import { ArticleCardCarousel } from '../../nutrition/article-carousel'
import { ArticleRecommendedCarousel } from '../../nutrition/article-recommended'

interface EmblaCarouselProps {
  sliderData: Slider[]
}

export const EmblaCarouselTips = (props: EmblaCarouselProps) => {
  const { sliderData } = props

  const [emblaRef, embla] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: false,
      direction: 'ltr',
      startIndex: 1
    }
  )

  useEffect(() => {
      if (!embla) return;
      // Start scrolling slowly
      const engine = embla.internalEngine();
      engine.scrollBody.useSpeed(0.05);
      engine.scrollTo.index(embla.scrollSnapList().length, -1);
  }, [embla]);

  return (
    <section className="h-full w-full pl-[10%]" >
      <div className="embla relative" ref={emblaRef} >
        <div className="grid grid-flow-col mr-[10%] "  >
          {sliderData.map(slide => {
            return <ArticleRecommendedCarousel key={slide.id} data={slide} />
          })}
        </div>
      </div>
    </section>
  )
}
