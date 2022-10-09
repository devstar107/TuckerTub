import type { IconProps } from '~/types'

export const BookIcon = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      width="50px"
      height="50px"
      viewBox="0 0 50 50"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>History@2x</title>
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
          id="Our-Story"
          transform="translate(-180.000000, -1084.000000)"
          stroke="#86CB92"
          strokeWidth="2.5"
        >
          <g id="History" transform="translate(180.000000, 1084.000000)">
            <path
              d="M37.5,8.63333333 C40.7604463,8.10934378 44.0561263,7.83493594 47.3583333,7.81230199 C47.6420974,7.80814037 47.9161154,7.91595073 48.1208333,8.1125 C48.3216867,8.30717782 48.435805,8.57445491 48.4375,8.85416667 L48.4375,41.7041667 C48.4318548,42.2771087 47.9687754,42.7401882 47.3958333,42.7458333 C30.11875,42.9604167 25,48.4375 25,48.4375 L25,13.5041667 C25,13.5041667 19.8854167,8.03333333 2.64166667,7.81230199 C2.35646802,7.80703404 2.08074768,7.91492461 1.875,8.1125 C1.67567853,8.30787286 1.56309871,8.57506231 1.5625,8.85416667 L1.5625,41.7041667 C1.56814516,42.2771087 2.03122464,42.7401882 2.60416667,42.7458333 C19.88125,42.9604167 25,48.4375 25,48.4375"
              id="Shape"
            />
            <path
              d="M25,47.4104167 C25.3291627,44.7103256 26.5250963,42.1898004 28.4083333,40.2270833 C30.8316611,37.6129781 34.0096446,35.8193546 37.5,35.0958333 L37.5,2.58958333 C37.4935295,2.24914543 37.3146301,1.93528695 37.025,1.75625 C36.7181069,1.56336597 36.3425986,1.51319685 35.9958333,1.61875 C33.0725556,2.45874921 30.4437064,4.10232132 28.4083333,6.3625 C26.5259047,8.32411157 25.3300307,10.843049 25,13.5416667"
              id="Shape"
            />
          </g>
        </g>
      </g>
    </svg>
  )
}