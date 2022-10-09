import { ButtonWithArrow } from '~/ui'

export const AccountContactButton = () => {
  return (
    <div className="m-auto grid w-[90%] grid-cols-1 gap-8 py-16 text-center text-base text-colorFourteen sm:grid-cols-2 lg:w-[60%]">
      <div className="flex justify-center">
        <p className="text-center text-lg font-bold">
          Need help with your account or orders? <br />
          Someone from our team will wag back shortly!
        </p>
      </div>
      <div className="m-auto w-[100%]">
        <ButtonWithArrow
          href="/contact"
          center
          buttonVariant="primary"
          className="m-auto w-[100%] lg:max-w-[240px]"
        >
          Contact
        </ButtonWithArrow>
      </div>
    </div>
  )
}
