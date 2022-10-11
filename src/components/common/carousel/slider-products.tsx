import { useCallback, useEffect, useMemo, useState, useRef } from 'react'

import useEmblaCarousel from 'embla-carousel-react'

import type { Slider } from '~/types'

import { ProductCardCarousel } from '../../commerce/product-card-carousel'

interface EmblaCarouselProps {
  sliderData: Slider[]
}

export const EmblaCarouselProducts = (props: EmblaCarouselProps) => {
  const { sliderData } = props

  const [emblaRef, embla] = useEmblaCarousel(
    {
      loop: false,
      dragFree: false
    }
  )

  const rafId = useRef(0);

  const animate1 = useCallback(() => {
    if (!embla || !rafId.current) return;
    const engine = embla.internalEngine();
    engine.location.add(-1);
    engine.target.set(engine.location);
    engine.scrollLooper.loop(-1);
    engine.translate.to(engine.location);
    rafId.current = requestAnimationFrame(animate1);
  }, [embla]);

  const animate2 = useCallback(() => {
    if (!embla || !rafId.current) return;
    const engine = embla.internalEngine();
    engine.location.add(-0.4);
    engine.target.set(engine.location);
    engine.scrollLooper.loop(1);
    engine.translate.to(engine.location);
    rafId.current = requestAnimationFrame(animate2);
  }, [embla]);

  const startAutoScroll = useCallback(() => {
    const engine = embla.internalEngine();
    if((engine.location.get() > 35 && engine.location.get() < 60) || (engine.location.get() < -2600)){
      console.log('.//.///.')
      engine.location.set(45)
    }else{
      engine.location.set(160)
    }
    rafId.current = requestAnimationFrame(animate1);
  }, [animate1]);

  const stopAutoScroll = useCallback(() => {
    rafId.current = cancelAnimationFrame(rafId.current) || 0;
  }, []);
 
  const mouseOver = useCallback(() => {
    stopAutoScroll()
  }, [embla]) 

  const mouseLeave = useCallback(() => {
    resumeAutoScroll()
  }, [embla]) 

  const resumeAutoScroll = useCallback(() => {
      const engine = embla.internalEngine();
      console.log('qweqweqwe', engine.location.get())
      if(engine.location.get() > 35 ){
        resumeAutoScroll();
      }else if (engine.location.get() < -2600){
        startAutoScroll()
      }
      rafId.current = requestAnimationFrame(animate1);
  }, [animate1, embla]);
  
  useEffect(() => {
    if (!embla) return;
    const engine = embla.internalEngine();
    if(engine.location.get() > 35 && engine.location.get() < 60){
      console.log('35')
      engine.location.set(45)
    }else{
      engine.location.set(160)
    }
    embla.on("pointerDown", stopAutoScroll);
    embla.on("settle", resumeAutoScroll);
    startAutoScroll()
    return () => stopAutoScroll();
  }, [embla, startAutoScroll, stopAutoScroll]);

  return (
    <section className="h-full w-full">
      <div className="embla relative" ref={emblaRef} onMouseOver={mouseOver} onMouseLeave={mouseLeave}>
        <div className="grid grid-flow-col">
          {sliderData.map(slide => {
            return <ProductCardCarousel key={slide.id} product={slide} />
          })}
        </div>
      </div>
    </section>
  )
}
