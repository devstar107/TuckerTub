import { ArrowRightIcon } from '@heroicons/react/solid'

import { MenuDB } from '~/constants/faq'

export const MenuItem = () => {
  return (
    <div className="space-y-4 pb-12 text-lg font-bold text-colorFourteen">
      {MenuDB.map(item => {
        return (
          <a
            key={item.id}
            href={item.url}
            className="flex items-center justify-start gap-2 text-lg"
          >
            {item.title}
            <ArrowRightIcon className="h-5 w-5" />
          </a>
        )
      })}
    </div>
  )
}
