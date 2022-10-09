import NextImage from 'next/future/image'
import NextLink from 'next/link'

import type { IMegaMenuItem } from '~/constants/mega-menu'
import { megaMenuItems } from '~/constants/mega-menu'
import { ButtonWithArrow } from '~/ui'

interface MegaMenuItemProps {
  megaMenuData: IMegaMenuItem
}

export const MobileMegaMenuItem = ({ megaMenuData }: MegaMenuItemProps) => {
  const { id, title, imageUrl } = megaMenuData
  return (
    <div>
      <div
        className="relative mx-auto h-[60px] w-[60px] bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/assets/shadows/${id}.svg)`
        }}
      >
        <NextImage
          className="h-[60px] w-[60px]"
          src={imageUrl}
          alt={title}
          width={120}
          height={70}
        />
      </div>
      <p className="text-lg font-bold text-colorFourteen">{title}</p>
    </div>
  )
}

export const MobileMegaMenu = () => {
  return (
    <section className="flex h-full w-full items-center justify-center">
      <div>
        <div className="m-auto grid max-w-[900px] grid-cols-2 place-items-center gap-10 text-center md:grid-cols-2 lg:grid-cols-2">
          {megaMenuItems.map(item => {
            return (
              <NextLink key={item.id} href={`/shop/${item.slug}`}>
                <MobileMegaMenuItem key={item.id} megaMenuData={item} />
              </NextLink>
            )
          })}
        </div>
        <div className="py-8">
          <ButtonWithArrow buttonVariant="secondary" containerSpanFull center href="/shop">
            Shop All Products
          </ButtonWithArrow>
        </div>
      </div>
    </section>
  )
}
