import { ButtonWithArrow, TextBold } from '~/ui'

export const Consultation = () => {
  return (
    <div className="m-auto grid w-[90%] grid-cols-1 gap-8 py-10 text-center text-base lg:w-[60%]">
      <TextBold className="text-center text-lg">
        Ready for your dog to benefit from the Tucker Tub Difference? Book a free consultation to
        get a customised feeding plan.
      </TextBold>
      <ButtonWithArrow
        href="/consultation"
        center
        buttonVariant="primary"
        className="m-auto w-[100%] lg:max-w-[240px]"
      >
        Book Consultation
      </ButtonWithArrow>
    </div>
  )
}
