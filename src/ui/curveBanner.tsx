import type { WrapperProps } from '~/types'

export const CurveBanner = ({ children, className = '' }: WrapperProps) => {
  return (
    <div className="h-full w-full">
      <div
        className={`curve absolute mt-[-1px] h-[550px] w-full bg-colorFifteen bg-no-repeat object-cover py-12 ${className}`}
      >
        {children}
        <svg
          width="1440"
          height="210"
          viewBox="0 0 1440 210"
          stroke="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <clipPath
            id="clip"
            clipPathUnits="objectBoundingBox"
            transform="scale(0.000694444444444, 0.001680672268908)"
          >
            <path d="M0,0 L1440.01025,0 C1440.01025,76 1440.01025,114 1440.01025,114 C952.800926,113.708648 593.552979,210 0,210 C0,210 0,140 0,0 Z" />
          </clipPath>
        </svg>
      </div>
    </div>
  )
}
