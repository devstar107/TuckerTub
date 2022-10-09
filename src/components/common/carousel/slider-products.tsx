import { useCallback, useEffect, useMemo, useState } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

import type { Slider } from '~/types'

import { ProductCardCarousel } from '../../commerce/product-card-carousel'

interface EmblaCarouselProps {
  sliderData: Slider[]
}

export const EmblaCarouselProducts = (props: EmblaCarouselProps) => {
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
    const engine = embla.internalEngine();
    engine.scrollBody.useSpeed(0);
    engine.scrollTo.index(embla.scrollSnapList().length, -1);
  }, [embla]) 

  const mouseLeave = useCallback(() => {
    if(!embla) return;
    const engine = embla.internalEngine()
    engine.scrollBody.useSpeed(0.01)
    engine.scrollTo.index(embla.scrollSnapList().length, -1);
  }, [embla]) 
   
  useEffect(() => {
      if (!embla) return;
      // Start scrolling slowly
      const engine = embla.internalEngine();
      engine.scrollBody.useSpeed(0.05);
      engine.scrollTo.index(embla.scrollSnapList().length, -1);
  }, [embla]);

  return (
    <section className="h-full w-full">
      <div className="embla relative" ref={emblaRef} onMouseOver={mouseOver} onMouseLeave={mouseLeave} onTouchStart={mouseOver} onTouchEnd={mouseLeave}>
        <div className="grid grid-flow-col">
          {sliderData.map(slide => {
            return <ProductCardCarousel key={slide.id} product={slide} />
          })}
        </div>
      </div>
    </section>
  )
}
