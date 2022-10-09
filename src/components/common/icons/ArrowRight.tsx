import type { IconProps } from '~/types'

interface ArrowRightProps extends IconProps {
  fill?: string
}

export const ArrowRight = (props: ArrowRightProps) => {
  const { className = '', fill } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      width="36px"
      height="36px"
      viewBox="0 0 36 36"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Arrow Right</title>
      <g
        id="Tucker-Tub---UI"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        fillOpacity="0.3"
      >
        <g
          id="Home"
          transform="translate(-534.000000, -1591.000000)"
          fill={fill ?? '#D0FFCE'}
          fillRule="nonzero"
        >
          <g id="Bold" transform="translate(534.000000, 1591.000000)">
            <path
              d="M18,0 C8.0588745,0 0,8.0588745 0,18 C0,27.9411255 8.0588745,36 18,36 C27.9411255,36 36,27.9411255 36,18 C35.9892527,8.06332957 27.9366704,0.0107472714 18,0 Z M27.468,19.083 L19.2,27.816 C18.9290667,28.1050306 18.5521841,28.2713682 18.1560596,28.2768786 C17.759935,28.2821201 17.3786772,28.1260716 17.1,27.8445 L16.6575,27.3945 C16.0728548,26.7955417 16.0454538,25.848251 16.5945,25.2165 L20.0445,21.357 C20.5935,20.742 20.3685,20.238 19.5435,20.238 L9.7935,20.238 C8.96507288,20.238 8.2935,19.5664271 8.2935,18.738 L8.2935,17.238 C8.2935,16.4095729 8.96507288,15.738 9.7935,15.738 L19.521,15.738 C20.346,15.738 20.571,15.24 20.007,14.6325 L16.4505,10.7655 C15.893646,10.1438303 15.9153091,9.19656369 16.5,8.601 L16.95,8.151 C17.2297022,7.87231438 17.6095789,7.71758819 18.0043996,7.72146265 C18.3992203,7.7254846 18.7759269,7.88777663 19.05,8.172 L27.465,16.9095 C28.0383308,17.5201176 28.039643,18.4708021 27.468,19.083 Z"
              id="Shape"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}