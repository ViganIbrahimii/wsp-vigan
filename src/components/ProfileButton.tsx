import * as React from "react"
import Image from "next/image"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { cn } from "@/lib/utils"
import { fontHeadline } from "@/styles/typography"

interface ProfileButtonProps {
  isActive: boolean
  onClick?: () => void
}

const PUBLISH_IMAGE_URL = "https://www.publiish.io/ipfs/"

export const ProfileButton: React.FC<ProfileButtonProps> = ({
  isActive,
  onClick,
}) => {
  const { user } = useAuth()

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-[48px] min-w-[48px] items-center justify-center rounded-full transition-colors",
        isActive ? "bg-brand" : "bg-black-10"
      )}
    >
      {user?.user_information.picture?.cid ? (
        <Image
          src={`${PUBLISH_IMAGE_URL}${user?.user_information.picture.cid}`}
          alt="Profile"
          width={48}
          height={48}
          className="h-12 max-h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-sm",
            fontHeadline,
            isActive ? "text-white-100" : "text-black-100"
          )}
        >
          {user?.user_information.first_name?.[0]?.toUpperCase() || "?"}
        </div>
      )}
    </button>
  )
}
