import { ButtonWithArrow, TextBold } from '~/ui'

export const LinkOurDifference = () => {
  return (
    <div className="m-auto grid w-[90%] grid-cols-1 gap-8 py-10 text-center text-base lg:w-[60%]">
      <TextBold className="text-center text-lg">
        What makes Tucker Tub different from all the big brand manufacturers and young startups?
      </TextBold>
      <ButtonWithArrow
        href="/our-difference"
        buttonVariant="primary"
        center
        className="m-auto w-[100%] lg:max-w-[240px]"
      >
        Our Difference
      </ButtonWithArrow>
    </div>
  )
}
