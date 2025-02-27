import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils" // Adjust the import path as necessary
import { fontButtonLarge } from "@/styles/typography"

export const ProgressButton = () => {
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const totalDuration = 180
  const progressRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 0.1, 0))
    }, 100) // Update every 100 milliseconds

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions() // Initial update

    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(0)
    }

    const progress = progressRef.current
    if (progress) {
      const length = progress.getTotalLength()
      const progressLength =
        ((totalDuration - timeLeft) / totalDuration) * length
      progress.style.strokeDasharray = `${length}`
      progress.style.strokeDashoffset = `${-progressLength}`
    }
  }, [timeLeft, totalDuration, dimensions])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const createPath = (width: number, height: number) => {
    const radius = height / 2
    const halfWidth = width / 2
    return `
      M ${halfWidth},0
      H ${width - radius}
      A ${radius},${radius} 0 0 1 ${width},${radius}
      V ${height - radius}
      A ${radius},${radius} 0 0 1 ${width - radius},${height}
      H ${radius}
      A ${radius},${radius} 0 0 1 0,${height - radius}
      V ${radius}
      A ${radius},${radius} 0 0 1 ${radius},0
      H ${halfWidth}
    `
  }

  return (
    <div ref={containerRef} className="relative inline-block p-[2px]">
      <svg className="absolute left-0 top-0 h-full w-full overflow-visible">
        <path
          ref={progressRef}
          d={createPath(dimensions.width, dimensions.height)}
          fill="none"
          stroke="var(--border-black-20)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <button
        className={cn(
          "flex h-[48px] w-full items-center justify-between gap-7 rounded-6 bg-status-accepted  px-8 text-center text-white-100 transition-colors hover:outline hover:outline-4 hover:outline-black-10 disabled:bg-black-5 disabled:text-black-40 disabled:outline-none ",
          fontButtonLarge
        )}
      >
        <h2>Accept All</h2>
        {/* <div className="relative h-[30px] w-[65px] rounded-md bg-black text-sm leading-5 text-white">
          {formatTime(timeLeft)}
        </div> */}
      </button>
    </div>
  )
}
