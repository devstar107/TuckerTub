import { useMemo, useCallback, useEffect } from 'react'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { SuggestedProductsCarousel } from '~/components/commerce/suggested-products-carousel'
import type { Slider } from '~/types'

interface EmblaCarouselProps {
  sliderData: Slider[]
}

export const EmblaSuggestedProducts = (props: EmblaCarouselProps) => {
  const { sliderData } = props

  // const randomSlideIndexOrder = useMemo(() => {
  //   const randomIndex = Math.floor(Math.random() * sliderData.length)
  //   return randomIndex
  // }, [sliderData])

  const [emblaRef, embla] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: false,
      direction: 'ltr',
      startIndex: 1
    }
  )


  const mouseOver = useCallback(() => {
    if(!embla) return;
    const engine = embla.internalEngine()
    engine.scrollBody.useSpeed(0);
  }) 

  const mouseLeave = useCallback(() => {
    if(!embla) return;
    const engine = embla.internalEngine()
    engine.scrollBody.useSpeed(0.05);
    engine.scrollTo.index(embla.scrollSnapList().length, -1);
  }) 
   
  useEffect(() => {
      if (!embla) return;
      // Start scrolling slowly
      const engine = embla.internalEngine();
      engine.scrollBody.useSpeed(0.07);
      engine.scrollTo.index(embla.scrollSnapList().length, -1);
  }, [embla]);

  return (
    <section className="h-full w-full ">
      <div className="embla relative h-full pl-[10%]" ref={emblaRef} onMouseOver={mouseOver} onMouseLeave={mouseLeave}>
        <div className="grid grid-flow-col">
          {sliderData.map(slide => {
            return <SuggestedProductsCarousel key={slide.id} product={slide} />
          })}
        </div>
      </div>
    </section>
  )
}
