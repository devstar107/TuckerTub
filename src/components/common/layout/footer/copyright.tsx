import NextImage from 'next/future/image'
import NextLink from 'next/link'

export const CopyRightFooter = () => {
  return (
    <div className="grid grid-cols-1 pt-8 text-[15px] md:grid-cols-[3fr_1fr]">
      <div className="grid grid-cols-1">
        <div>
          <span>Copyright &copy; 2022 Tucker Tub Pet Food.</span>
          <br className="block sm:hidden" />{' '}
          <div className="inline-block space-x-4">
            <span>All rights reserved.</span>
            <NextLink
              href="/policies/terms-and-conditions"
              className="underline decoration-0 underline-offset-2"
            >
              Terms of Service
            </NextLink>
            <NextLink
              href="/policies/privacy-policy"
              className="underline decoration-0 underline-offset-2"
            >
              Privacy
            </NextLink>
            <NextLink
              href="/policies/cookie-policy"
              className="underline decoration-0 underline-offset-2"
            >
              Cookies
            </NextLink>
          </div>
        </div>
      </div>
      <div className="flex items-center pt-2 sm:justify-end sm:self-end">
        <span className="pr-2">Created by</span>
        <a href="https://www.tigerheart.com" target="_blank" rel="noopener noreferrer">
          <NextImage
            src="/assets/icons/logo-tigerheart.svg"
            alt="Tigerheart"
            width={87}
            height={16}
          />
        </a>
      </div>
    </div>
  )
}
