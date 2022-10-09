import type { IInfoCard } from '~/types'

import { TextBold } from './textBold'
import { Title } from './title'

interface InfoCardProps {
  cardData: IInfoCard
}

export const InfoCard = ({ cardData }: InfoCardProps) => {
  const { heading, subheading, description, icon: Icon, className = '' } = cardData
  return (
    <div
      className={`space-y-5 rounded-lg bg-colorFifteen/10 px-8 py-12 font-haboro-soft text-colorFifteen transition duration-300 ease-in-out hover:-translate-y-2 hover:bg-colorFifteen/[0.12] ${className}`}
    >
      {Icon}
      <Title>{heading}</Title>
      <TextBold>{subheading}</TextBold>
      <div className="w-full font-haboro-soft text-base">{description}</div>
    </div>
  )
}
