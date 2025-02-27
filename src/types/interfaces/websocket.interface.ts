import { Dispatch, SetStateAction } from "react"
import { WebsocketInstances } from "@/constants/websocketInstances"
import { Channel, EchoWithSubscriptions } from "@/providers/WebSocketProvider"
import Echo from "laravel-echo"

export interface WebSocketMessage {
  type?: "private" | "public" | "error"
  message: unknown
  channelName?: string
  eventName?: string
  brandId?: string | null
}

export interface WebSocketConfig {
  key: string
  host: string
  apiUrl: string
  wsHost?: string
  forceTLS?: boolean
  token?: string | null
  brandId: string
}

export interface WebSocketContextType {
  messages: Partial<Record<WebsocketInstances, WebSocketMessage>>
  setMessages: Dispatch<
    SetStateAction<Partial<Record<WebsocketInstances, WebSocketMessage>>>
  >
  connect: (id: WebsocketInstances[]) => void
  disconnect: (id: WebsocketInstances) => void
  subscribe: (id: WebsocketInstances, channels: Channel[]) => void
  instancesRef: React.MutableRefObject<
    Map<WebsocketInstances, EchoWithSubscriptions>
  >
  connections: Partial<Record<WebsocketInstances, boolean>>
}
