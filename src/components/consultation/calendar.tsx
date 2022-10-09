import { useEffect } from 'react'

import { useRouter } from 'next/router'

import { TextBold } from '~/ui'

export const Calendar = () => {
  const router = useRouter()
  useEffect(() => {
    const script = document.createElement('script')

    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [router.events])

  return (
    <div className="space-y-7 lg:pt-0">
      <TextBold className="text-xl">Select a Date & Time</TextBold>
      <div className="rounded-lg bg-colorFifteen p-2">
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/tucker-tub/free-consultation?hide_landing_page_details=1&hide_event_type_details=1&hide_gdpr_banner=1&background_color=fff7f0&text_color=014032&primary_color=014032"
          style={{
            height: '500px',
            maxWidth: '560px'
          }}
        />
      </div>
    </div>
  )
}
