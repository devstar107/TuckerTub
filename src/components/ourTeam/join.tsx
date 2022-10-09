import { ButtonWithArrow, TextBold } from '~/ui'

export const JoinTeam = () => {
  return (
    <div className="m-auto grid w-[90%] grid-cols-1 gap-8 text-center text-base text-colorFifteen lg:w-[60%]">
      <TextBold className="text-center text-lg">
        Love looking after the health of dogs? Join the Tucker Tub Team by becoming a Distributor.
      </TextBold>
      <ButtonWithArrow
        href="/contact"
        center
        buttonVariant="primary"
        className="m-auto w-[100%] lg:w-[240px]"
      >
        Join the Team
      </ButtonWithArrow>
    </div>
  )
}
