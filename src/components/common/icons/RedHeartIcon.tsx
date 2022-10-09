import type { IconProps } from '~/types'

export const RedHeartIcon = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      width="61px"
      height="54px"
      viewBox="0 0 61 54"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Care@2x</title>
      <g
        id="Tucker-Tub---UI"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g
          id="Our-Difference"
          transform="translate(-764.000000, -1486.000000)"
          stroke="#993955"
          strokeWidth="2.5"
        >
          <path
            d="M794.324543,1538.15756 L769.972758,1512.75937 C765.583422,1508.37348 764.495645,1501.66979 767.27293,1496.12101 L767.27293,1496.12101 C769.344479,1491.97911 773.280642,1489.08538 777.851924,1488.34371 C782.423207,1487.60204 787.072362,1489.10284 790.347186,1492.37732 L794.324543,1496.35214 L798.301899,1492.37732 C801.576724,1489.10284 806.225878,1487.60204 810.797161,1488.34371 C815.368444,1489.08538 819.304607,1491.97911 821.376156,1496.12101 L821.376156,1496.12101 C824.149553,1501.66743 823.063099,1508.36621 818.678868,1512.75175 L794.324543,1538.15756 Z"
            id="Care"
          />
        </g>
      </g>
    </svg>
  )
}
