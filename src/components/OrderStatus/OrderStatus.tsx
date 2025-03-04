"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CloseIcon, FullscreenIcon } from "@/icons"
import { useFullscreen } from "@/providers/FullscreenProvider"

import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import {
  fontBodyNormal,
  fontHeadline,
  fontTitle1,
  fontTitle2,
} from "@/styles/typography"

import { mockBrand, mockOrders, type Order } from "./mockData"

export default function OrderStatus() {
  const { isFullscreen, setIsFullscreen } = useFullscreen()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [preparingOrders, setPreparingOrders] = useState<Order[]>([])
  const [readyOrders, setReadyOrders] = useState<Order[]>([])
  const [autoScrollTimeout, setAutoScrollTimeout] =
    useState<NodeJS.Timeout | null>(null)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setPreparingOrders(
        mockOrders.filter((order) => order.status === "preparing")
      )
      setReadyOrders(mockOrders.filter((order) => order.status === "ready"))
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle auto-scroll
  const handleMouseMove = () => {
    if (autoScrollTimeout) {
      clearTimeout(autoScrollTimeout)
    }

    const timeout = setTimeout(() => {
      // Implement auto-scroll logic here
      // This would scroll through the orders when inactive
    }, 5000)

    setAutoScrollTimeout(timeout)
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      if (autoScrollTimeout) {
        clearTimeout(autoScrollTimeout)
      }
    }
  }, [autoScrollTimeout])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center lg:h-screen">
        <p className={cn(fontBodyNormal, "rounded-5 bg-white-60 px-2")}>
          Loading orders...
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col px-4 lg:h-screen">
      {/* Top Section */}
      <div className="flex items-center justify-between py-7">
        <h1 className={cn(fontTitle1)}>Order Status</h1>
        <IconButton
          icon={isFullscreen ? CloseIcon : FullscreenIcon}
          iconSize="24"
          size="large"
          variant="transparent"
          onClick={handleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          text={isFullscreen ? "Exit FullScreen" : "FullScreen"}
        />
      </div>

      {/* Middle Section */}
      <div className="mb-4 flex items-center justify-between rounded-5 bg-black-5 p-4">
        <div className="flex items-center gap-4">
          {mockBrand.logo ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-5">
              <Image
                src={mockBrand.logo}
                alt={mockBrand.name}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-5 bg-black-10">
              <span className={cn(fontHeadline, "text-black-100")}>
                {mockBrand.initials}
              </span>
            </div>
          )}
          <h2 className={cn(fontHeadline, "text-black-100")}>
            {mockBrand.name}
          </h2>
        </div>
        <div className={cn(fontTitle1, "text-black-100")}>
          {currentTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-grow space-x-4">
        {/* Preparing Orders */}
        <div
          className={cn(
            "flex flex-col rounded-5 bg-white-100",
            isFullscreen ? "h-[calc(100vh-150px)]" : "h-[calc(100vh-225px)]",
            "md:w-1/2 lg:w-[calc(100%-380px)]"
          )}
        >
          <div className="sticky top-0 z-10 flex justify-center rounded-5 bg-white-100 p-4">
            <h2 className={cn(fontTitle1, "w-fit rounded-5")}>Preparing</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 overflow-auto p-4">
            {preparingOrders.map((order) => (
              <div
                key={order.id}
                className="flex h-[64px] w-[106px] items-center justify-center rounded-3 bg-black-10"
              >
                <span className={cn(fontTitle2, "text-black-100")}>
                  {order.id}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ready Orders */}
        <div
          className={cn(
            "flex flex-col rounded-5 bg-white-100",
            isFullscreen ? "h-[calc(100vh-150px)]" : "h-[calc(100vh-225px)]",
            "md:w-1/2 lg:w-[380px]"
          )}
        >
          <div className="sticky top-0 z-10 flex justify-center rounded-5 bg-white-100 p-4">
            <h2 className={cn(fontTitle1, "w-fit rounded-5")}>Ready</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 overflow-auto p-4">
            {readyOrders.map((order, index) => (
              <div
                key={order.id}
                className={cn(
                  "flex items-center justify-center rounded-3 bg-status-accepted text-white-100",
                  index === 0 ? "h-[112px] w-full" : "h-[64px] w-[106px]"
                )}
              >
                <span className={cn(fontTitle2)}>{order.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
