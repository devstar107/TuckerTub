import NextImage from 'next/future/image'
import NextLink from 'next/link'

import type { IMegaMenuItem } from '~/constants/mega-menu'
import { megaMenuItems } from '~/constants/mega-menu'
import { ButtonWithArrow } from '~/ui'

interface MegaMenuItemProps {
  megaMenuData: IMegaMenuItem
}

export const MegaMenuItem = ({ megaMenuData }: MegaMenuItemProps) => {
  const { id, title, imageUrl } = megaMenuData
  return (
    <div className="h-full w-full">
      <div
        className="relative mx-auto h-[120px] w-[120px] bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/assets/shadows/${id}.svg)`
        }}
      >
        <NextImage
          className="h-[120px] w-[120px]"
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

export const MegaMenu = () => {
  return (
    <section className="flex h-[300px] w-full items-center justify-center">
      <div>
        <div className="m-auto grid max-w-[900px] grid-cols-2 place-items-center gap-x-32 text-center md:grid-cols-2 lg:grid-cols-4">
          {megaMenuItems.map(item => {
            return (
              <NextLink key={item.id} href={`/shop/${item.slug}`}>
                <MegaMenuItem key={item.id} megaMenuData={item} />
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
