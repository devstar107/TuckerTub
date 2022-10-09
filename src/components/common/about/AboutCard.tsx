/* eslint-disable react/no-danger */

interface IAboutCardProps {
  content: string
}

export const AboutCard = (props: IAboutCardProps) => {
  const { content } = props

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content
      }}
    />
  )
}
