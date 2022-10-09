import type { HTMLAttributes } from 'react'

import NextImage from 'next/future/image'

export const SocialFooter = (props: HTMLAttributes<HTMLDivElement>) => {
  const { className } = props
  return (
    <div className={className}>
      <p className="py-4 text-base">Follow Tucker Tub</p>
      <div className="flex flex-wrap gap-4">
        <a
          href="https://www.facebook.com/tuckertubpetfood"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NextImage src="/assets/social/facebook.svg" alt="Facebook" height={24} width={24} />
        </a>
        <a
          href="https://www.instagram.com/tuckertubpetfood"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NextImage src="/assets/social/instagram.svg" alt="Instagram" height={24} width={24} />
        </a>
      </div>
    </div>
  )
}
