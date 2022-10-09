import type { IconProps } from '~/types'

export const EmailIcon = (props: IconProps) => {
  const { className = '' } = props
  return (
    <svg
      {...props}
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 26 26"
    >
      <path
        fill="none"
        stroke="#014032"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M1.07948508,9.39103701 C0.453794265,9.21452784 0.0162253495,8.65079711 0.000440610327,8.00087763 C-0.0153441289,7.35095815 0.394342109,6.76664994 1.01072643,6.55997422 L21.0115224,0.0368707097 C21.278652,-0.0502094683 21.5720497,0.0196696714 21.7712464,0.217815754 C21.9704431,0.415961836 22.0418728,0.708985914 21.9562065,0.976572299 L15.4380855,20.9873333 C15.2323147,21.6048382 14.6474442,22.0155793 13.9967546,21.9995468 C13.346065,21.9835143 12.7821327,21.5444677 12.6070227,20.9175781 L10.3688787,11.619216 L1.07948508,9.39103701 Z M21.7718536,0.216241109 L10.3688787,11.619216"
      />
    </svg>
  )
}
