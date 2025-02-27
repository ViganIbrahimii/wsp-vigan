"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { WebsocketInstances } from "@/constants/websocketInstances"
import { usePathname } from "@/i18n/routing"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import Echo from "laravel-echo"
import Pusher from "pusher-js"

import { env } from "@/env.mjs"
import {
  WebSocketContextType,
  WebSocketMessage,
} from "@/types/interfaces/websocket.interface"

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
)

export interface EchoWithSubscriptions extends Echo<"reverb"> {
  subscribedChannels?: Set<string>
}

export type Channel = {
  name: string
  callback?: (data: any, eventName: string, channelName: string) => void
}

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const instancesRef = useRef(
    new Map<WebsocketInstances, EchoWithSubscriptions>()
  )
  const [connections, setConnections] = useState<
    Partial<Record<WebsocketInstances, boolean>>
  >({})

  const [messages, setMessages] = useState<
    Partial<Record<WebsocketInstances, WebSocketMessage>>
  >({})

  const { brandId, authToken } = useAuth()

  const websocketInstanceConfig = {
    [WebsocketInstances.ORDERIFIC]: {
      key: env.NEXT_PUBLIC_ORDERIFIC_WEBSOCKET_KEY,
      host: env.NEXT_PUBLIC_ORDERIFIC_WEBSOCKET_HOST,
      apiUrl: env.NEXT_PUBLIC_API_URL,
      token: authToken,
      brandId: brandId || "",
    },
    [WebsocketInstances.INTERNETCASH]: {
      key: env.NEXT_PUBLIC_INTERNETCASH_WEBSOCKET_KEY,
      host: env.NEXT_PUBLIC_INTERNETCASH_WEBSOCKET_HOST,
      apiUrl: env.NEXT_PUBLIC_INTERNETCASH_URL,
      token: authToken,
      brandId: brandId || "",
    },
  }

  const connect = useCallback((instancesToConnect: WebsocketInstances[]) => {
    const instances = instancesRef.current

    instancesToConnect.forEach((id) => {
      if (instances.has(id)) {
        console.log(`WebSocket instance with ID '${id}' already exists.`)
        return
      }

      const config = websocketInstanceConfig[id]
      if (!config) {
        console.log(`No configuration found for WebSocket instance '${id}'.`)
        return
      }

      Pusher.logToConsole = false
      const echoInstance = new Echo({
        broadcaster: "reverb",
        key: config.key,
        wsHost: config.host,
        forceTLS: true,
        authEndpoint: `${config.apiUrl}/broadcasting/auth`,
        disableStats: true,
        auth: {
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: "application/json",
          },
        },
        enabledTransports: ["ws", "wss"],
      })

      echoInstance.connector.pusher.connection.bind("connected", () => {
        console.log(`WebSocket instance '${id}' connected.`)
        setConnections((prev) => ({ ...prev, [id]: true }))
      })

      echoInstance.connector.pusher.connection.bind("disconnected", () => {
        console.log(`WebSocket instance '${id}' disconnected.`)
        setConnections((prev) => ({ ...prev, [id]: false }))
      })

      echoInstance.connector.pusher.connection.bind("error", (error: any) => {
        console.error(`WebSocket instance '${id}' error:`, error)
      })

      instances.set(id, echoInstance)
    })
  }, [])

  const disconnect = useCallback((id: WebsocketInstances) => {
    const instances = instancesRef.current
    const instance = instances.get(id)

    if (instance) {
      instance.disconnect()
      instances.delete(id)

      if (instance.subscribedChannels) {
        instance.subscribedChannels.clear()
      }

      // Update the connection state
      setConnections((prev) => ({ ...prev, [id]: false }))

      console.log(`WebSocket instance '${id}' disconnected and removed.`)
    } else {
      console.warn(`No WebSocket instance found with ID '${id}'.`)
    }
  }, [])

  const disconnectAll = useCallback(() => {
    const instances = instancesRef.current

    instances.forEach((_, id) => {
      const instance = instances.get(id)
      if (instance) {
        instance.disconnect()

        if (instance.subscribedChannels) {
          instance.subscribedChannels.clear()
        }

        console.log(`WebSocket instance '${id}' disconnected and removed.`)
      }
    })

    instances.clear()
    setConnections({})
    setMessages({})
  }, [])

  const subscribe = useCallback(
    (id: WebsocketInstances, channels: Channel[]) => {
      const instances = instancesRef.current
      const instance = instances.get(id)

      if (!instance) {
        console.log(`No WebSocket instance found with ID '${id}'.`)
        return
      }

      // Initialize `subscribedChannels` for the specific instance if not already set
      if (!instance.subscribedChannels) {
        instance.subscribedChannels = new Set<string>()
      }

      const subscribedChannels = instance.subscribedChannels

      channels.forEach(({ name, callback }) => {
        const channel = `${name}.${brandId}`

        // Skip if already subscribed
        if (subscribedChannels.has(channel)) {
          console.log(
            `Already subscribed to channel '${channel}' on instance '${id}'.`
          )
          return
        }

        // Add to subscribed channels
        subscribedChannels.add(channel)

        // Subscribe to the channel
        instance
          .private(channel)
          .listenToAll((eventName: string, data: any) => {
            const newMessage = {
              type: "private",
              message: data,
              channelName: name,
              brandId: brandId,
              eventName,
            }

            // Update messages state
            setMessages((prev) => ({
              ...(prev || {}),
              [id]: newMessage,
            }))

            // Execute the callback if provided
            if (callback) {
              callback(data, eventName, channel)
            }
          })

        console.log(`Subscribed to channel '${name}' on instance '${id}'.`)
      })
    },
    [brandId]
  )

  useEffect(() => {
    if (!authToken) {
      console.log("disconnect")
      disconnectAll() // Clean up all instances when logged out
    }
  }, [authToken, disconnectAll])

  useEffect(() => {
    if (pathname === "/login") {
      return
    }
    console.log("connect")
    connect([WebsocketInstances.ORDERIFIC, WebsocketInstances.INTERNETCASH])
  }, [connect, authToken, brandId, pathname])

  return (
    <WebSocketContext.Provider
      value={{
        connect,
        disconnect,
        subscribe,
        messages,
        instancesRef,
        setMessages,
        connections,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider"
    )
  }
  return context
}
