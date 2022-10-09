import type { IconProps } from '~/types'

export const AccountIcon = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      width="26px"
      height="26px"
      viewBox="0 0 26 26"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>My Account</title>
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
          id="Nutrition"
          transform="translate(-1338.000000, -76.000000)"
          stroke="#014032"
          strokeWidth="2.5"
        >
          <g id="Nav-Bar" transform="translate(0.000000, 44.000000)">
            <g id="Account" transform="translate(1340.000000, 34.000000)">
              <path d="M0,22 C0.0184437912,20.429059 0.345475429,18.8770602 0.9625,17.43225 C1.63625,16.083375 4.453625,15.148375 7.990125,13.839375 C8.952625,13.484625 8.789,10.987625 8.3655,10.5215 C6.99890058,9.04473446 6.32844881,7.05439333 6.523,5.05175 C6.40047662,3.77749848 6.8131099,2.50965077 7.66215572,1.55160582 C8.51120155,0.593560875 9.7202598,0.0315269177 11,0 C12.2797402,0.0315269177 13.4887985,0.593560875 14.3378443,1.55160582 C15.1868901,2.50965077 15.5995234,3.77749848 15.477,5.05175 C15.6722157,7.05265494 15.0038582,9.04171898 13.64,10.51875 C13.2165,10.984875 13.05975,13.481875 14.015375,13.836625 C17.551875,15.145625 20.36925,16.080625 21.043,17.4295 C21.6584891,18.875547 21.9836562,20.4285002 22,22 L0,22 Z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
