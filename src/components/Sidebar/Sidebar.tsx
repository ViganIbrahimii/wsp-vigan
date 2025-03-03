"use client"

import * as React from "react"
import Image from "next/image"
import { Route, routes } from "@/constants/routes"
import { Link, usePathname } from "@/i18n/routing"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { useFullscreen } from "@/providers/FullscreenProvider"

import { useOtpNotifications } from "@/lib/hooks/utilityHooks/useOtpNotifications"
import { cn } from "@/lib/utils"
import { IconButton } from "@/components/iconButton"
import { ProfileButton } from "@/components/ProfileButton"

import { Badge } from "../badge"

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { brandId } = useAuth()
  const { isFullscreen } = useFullscreen()

  const pathname = usePathname()

  const { pendingCount } = useOtpNotifications(brandId || "")

  const currentRoute = routes.find((route) => route.href === pathname)

  if (
    isFullscreen ||
    !currentRoute ||
    (!currentRoute.includeMainSidebar && !currentRoute.includeSecondarySidebar)
  ) {
    return <div>{children}</div>
  }

  const renderSecondaySidebarButton = (item: Route, index: number) => {
    if (item.href === "/profile") {
      return (
        <Link href={item.href} key={`${item.href}-${index}`}>
          <ProfileButton key={index} isActive={pathname === item.href} />
        </Link>
      )
    }

    return (
      <Link href={item.href} key={`${item.href}-${index}`}>
        <IconButton
          key={index}
          variant="sidebarBlack"
          icon={item.icon}
          iconSize="20"
          size="large"
          isActive={pathname === item.href}
        />
      </Link>
    )
  }

  const renderMainSidebarButton = (item: Route, index: number) => {
    const showBadge = item.hasBadge && item.href === "/otp-confirmation"
    const badgeRightClass =
      pendingCount >= 10 ? "right-[-4px] py-2" : "right-[0px]"

    const badgeClasses = cn(
      "absolute top-1 inline-flex transform -translate-y-1/2 border-2 border-black-100",
      badgeRightClass
    )

    return (
      <div key={`${item.href}-${index}`} className="relative">
        <Link href={item.href}>
          <IconButton
            variant="sidebarWhite"
            icon={item.icon}
            iconSize="20"
            size="large"
            isActive={pathname === item.href}
          />
        </Link>
        {showBadge && pendingCount > 0 && (
          <Badge
            count={pendingCount}
            className={cn(badgeClasses)}
            size="small"
            variant="red"
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-transparent text-black-100">
      <div
        className={cn(
          "z-50 flex lg:fixed lg:left-0 lg:my-0 lg:h-full lg:w-24 lg:flex-col",
          "fixed bottom-auto left-[16px] right-[16px] top-0 my-4 h-[64px] w-auto flex-row rounded-6",
          "items-center justify-between bg-transparent py-4",
          "bg-white-100 lg:bg-transparent"
        )}
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={64}
          height={64}
          className="h-16 w-16"
        />
        <div
          className={cn(
            "fixed bottom-[32px] left-1/2 top-auto h-[64px] w-auto -translate-x-1/2 flex-row",
            "lg:auto lg:bottom-auto lg:left-auto lg:h-auto lg:w-fit lg:-translate-x-0 lg:flex-col",
            "z-50 flex gap-2 rounded-6 bg-black-100 px-2 py-2 lg:relative"
          )}
        >
          {routes
            .filter((route) => route.includeMainSidebar)
            .map((item, index) => renderMainSidebarButton(item, index))}
        </div>

        <div className="z-10 flex w-fit flex-row gap-2 rounded-6 bg-white-100 px-2 py-2 lg:flex-col">
          {routes
            .filter((route) => route.includeSecondarySidebar)
            .map((item, index) => renderSecondaySidebarButton(item, index))}
        </div>
      </div>
      <div
        className={cn(
          "ml-0 pt-20",
          "flex flex-grow flex-col overflow-auto lg:ml-20 lg:pt-0"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Sidebar
