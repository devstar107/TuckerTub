import Lottie from 'lottie-react'

import BookConsultation from '/public/assets/data/lottie/Tucker-Tub_Book-Consultation.json'
import DeliveredFresh from '/public/assets/data/lottie/Tucker-Tub_Delivered-to-Door.json'
import OrderOnline from '/public/assets/data/lottie/Tucker-Tub_Order-Online.json'

export const LottieBadges = () => {
  const steps = [
    {
      id: 1,
      animation: BookConsultation,
      description: 'Book a free consultation'
    },
    {
      id: 2,
      animation: OrderOnline,
      description: 'Order food online'
    },
    {
      id: 3,
      animation: DeliveredFresh,
      description: 'Delivered fresh to your door'
    }
  ]

  return (
    <section
      id="trust-badge-container"
      className="container grid h-full w-full grid-cols-2 place-items-center lg:grid-cols-3"
    >
      {steps.map(({ id, description, animation }, index) => {
        return (
          <div
            key={id}
            className={index === steps.length - 1 ? 'col-span-full lg:col-auto' : undefined}
          >
            <div
              className="relative mx-auto h-44 w-44 bg-contain bg-center bg-no-repeat  transition duration-300 ease-in-out hover:scale-105 sm:h-72 sm:w-72"
              style={{
                backgroundImage: `url(/assets/shadows/${index + 2}.svg)`
              }}
            >
              <Lottie
                animationData={animation}
                loop
                autoplay
                className="max-h-[280px] max-w-[280px]"
              />
              <div className="absolute -bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-colorFourteen text-xl text-white sm:h-14 sm:w-14 sm:text-3xl">
                {index + 1}
              </div>
            </div>
            <p className="text py-5 text-center text-lg font-bold text-colorFourteen lg:text-list">
              {description}
            </p>
          </div>
        )
      })}
    </section>
  )
}
