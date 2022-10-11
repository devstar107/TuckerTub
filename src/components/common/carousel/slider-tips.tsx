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
      loop: false,
      dragFree: false
    }
  )

  const rafId = useRef(0);

  const animate = useCallback(() => {
    if (!embla || !rafId.current) return;
    const engine = embla.internalEngine();
    engine.location.add(-0.4);
    engine.target.set(engine.location);
    engine.translate.to(engine.location);
    rafId.current = requestAnimationFrame(animate);
  }, [embla]);

  const startAutoScroll = useCallback(() => {
    const engine = embla.internalEngine();
    engine.location.set(160)
    rafId.current = requestAnimationFrame(animate);
  }, [animate, embla]);

  const resumeAutoScroll = useCallback(() => {
    const engine = embla.internalEngine();
    if(engine.location.get() > 160 ){
      startAutoScroll();
    }else{
      rafId.current = requestAnimationFrame(animate);
    } 
  }, [animate, embla]);

  const stopAutoScroll = useCallback(() => {
    rafId.current = cancelAnimationFrame(rafId.current) || 0;
  }, []);

  const mouseOver = useCallback(() => {
    stopAutoScroll()
  }, [embla]) 

  const mouseLeave = useCallback(() => {
    resumeAutoScroll()
  }, [embla]) 

  useEffect(() => {
    if (!embla) return;
    const engine = embla.internalEngine()
    engine.location.set(160)
    embla.on("pointerDown", stopAutoScroll)
    embla.on("settle", resumeAutoScroll)
    resumeAutoScroll()
    setInterval(() => {
      startAutoScroll()
    }, 20000)
    return () => stopAutoScroll()
  }, [embla, startAutoScroll, stopAutoScroll])


  return (
    <section className="h-full w-full">
      <div className="embla relative" ref={emblaRef} onMouseOver={mouseOver} onMouseLeave={mouseLeave}>
        <div className="flex">
          {sliderData.map((index) => (
            <div key={index}>
              <div>
                <ArticleRecommendedCarousel key={index.id} data={index} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
   
  )
} 
