import type { WrapperProps } from '~/types'

export const CurveArticle = ({ children, className = '' }: WrapperProps) => {
  return (
    <div className="h-full w-full">
      <div
        className={`curve relative h-[300px] w-full bg-colorFourteen bg-no-repeat object-cover lg:h-[500px] ${className} `}
      >
        {children}
        <svg
          width="1440"
          height="608"
          viewBox="0 0 1440 608"
          stroke="0"
          fill="#014032"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <clipPath
            id="clip"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.000694444444444, 0.001680672268908)"
          >
            <path d="M0,0H1440V504.17c-487.2-.25-846.5,78.83-1440,78.83V0Z" />
          </clipPath>
        </svg>
      </div>
    </div>
  )
}
