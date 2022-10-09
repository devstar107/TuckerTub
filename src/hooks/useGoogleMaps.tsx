import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'

import { Loading } from '~/components/common'

export const RenderGoogleMaps = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  })

  const center = {
    lat: -37.19922644019883,
    lng: 145.06411883768536
  }

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true
  }

  function handleClickMarker() {
    window.open(
      `https://www.google.com.au/maps/place/Tucker+Tub+Pet+Food/@-37.1994737,145.0634979,18.04z/data=!4m12!1m6!3m5!1s0x6ad79411d9319069:0x1ffbf45a748b3992!2sTucker+Tub+Pet+Food!8m2!3d-37.199344!4d145.064129!3m4!1s0x6ad79411d9319069:0x1ffbf45a748b3992!8m2!3d-37.199344!4d145.064129`,
      '_blank'
    )
  }

  if (!isLoaded) {
    return (
      <div className="map-container">
        <Loading />
      </div>
    )
  }

  if (loadError) {
    return <div className="map-container">error</div>
  }

  return (
    <GoogleMap
      id="google-map-container"
      mapContainerClassName="map-container"
      zoom={15}
      center={center}
      options={mapOptions}
    >
      <Marker onClick={handleClickMarker} clickable position={center} />
    </GoogleMap>
  )
}
