import { useMemo, useCallback, useEffect, useRef } from 'react'

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
      dragFree: false
    }
  )

  const rafId = useRef(0);

  const animate = useCallback(() => {
    if (!embla || !rafId.current) return;

    const engine = embla.internalEngine();
    engine.location.add(-0.4);
    engine.target.set(engine.location);
    engine.scrollLooper.loop(-1);
    engine.translate.to(engine.location);
    rafId.current = requestAnimationFrame(animate);
  }, [embla]);

  const startAutoScroll = useCallback(() => {
    rafId.current = requestAnimationFrame(animate);
  }, [animate]);

  const stopAutoScroll = useCallback(() => {
    rafId.current = cancelAnimationFrame(rafId.current) || 0;
  }, []);

  const mouseOver = useCallback(() => {
    stopAutoScroll()
  }, [embla]) 

  const mouseLeave = useCallback(() => {
    startAutoScroll()
  }, [embla]) 

  useEffect(() => {
    if (!embla) return;

    embla.on("pointerDown", stopAutoScroll);
    embla.on("settle", startAutoScroll);

    startAutoScroll();
    return () => stopAutoScroll();
  }, [embla, startAutoScroll, stopAutoScroll]);

  return (
    <section className="h-full w-full ">
      {/* <div className="embla relative h-full pl-[10%]" ref={emblaRef} onMouseOver={mouseOver} onMouseLeave={mouseLeave}>
        <div className="grid grid-flow-col">
          {sliderData.map(slide => {
            return <SuggestedProductsCarousel key={slide.id} product={slide} />
          })}
        </div>
      </div> */}
       <div className="embla">
          <div className="embla__viewport " ref={emblaRef} onMouseOver={mouseOver} onMouseLeave={mouseLeave}>
            <div className="embla__container">
              {sliderData.map((index) => (
                <div className="embla__slide " key={index}>
                  <div className="embla__slide__inner">
                  <SuggestedProductsCarousel key={index.id} product={index} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  )
}
