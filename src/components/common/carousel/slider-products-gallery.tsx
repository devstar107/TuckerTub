import { useMemo, useCallback, useEffect, useState, useRef } from 'react'

import Autoplay from 'embla-carousel-autoplay'
import { ArrowRight } from '~/components/common/icons'
import useEmblaCarousel from 'embla-carousel-react'

import type { Slider } from '~/types'
import { GalleryProductsCarousel } from '~/components/commerce/gallery-products-carousel'

interface EmblaCarouselProps {
  sliderData: Slider[]
}

export const EmblaGalleryProducts = (props: EmblaCarouselProps) => {
  const { sliderData } = props

  const autoplay = useRef(
    Autoplay()
  );

  const [emblaRef, embla] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false
    }
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollNext = useCallback(() => {
    if (!embla) return;
    embla.scrollNext();
    autoplay.current.reset();
  }, [embla]);

  const scrollPrev = useCallback(() => {
    if (!embla) return;
    embla.scrollPrev();
    autoplay.current.reset();
  }, [embla]);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
    if(embla.canScrollNext() === false){
      setTimeout(function(){
        for(let i = 0; i < sliderData.length; i ++){
          scrollPrev()
        }
      }, 2800)
    }
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
    scrollNext(); 
    setInterval(() => {
      scrollNext(); 
    }, 3100)
  }, [embla, onSelect]);

  return (
    <section className='w-full h-full'>
      <div className='absolute right-[50%] top-[114%] cursor-pointer' onClick={scrollNext}><ArrowRight fill="rgb(203, 153, 114)" /></div>
      <div className="embla">
        <div className="embla__viewport">
          <div className="embla relative h-full" ref={emblaRef}>
            <div style={{display: '-webkit-box'}} className="gap-5">
              {sliderData.map(slide => {
                return <GalleryProductsCarousel key={slide.id} product={slide} />
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
