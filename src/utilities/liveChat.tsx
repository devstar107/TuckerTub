import { LiveChatWidget } from '@livechat/widget-react'

export const LiveChat = () => {
  return <LiveChatWidget license={process.env.NEXT_PUBLIC_LIVE_CHAT_LICENSE as string} />
}
