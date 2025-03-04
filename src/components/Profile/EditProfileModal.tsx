// Path: Documents\Work\orderific-service-panels-v2\client\src\components\Profile\EditProfileModal.tsx

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { revalidateLayout } from "@/actions/auth"
import { UpdateProfileBody } from "@/api/profile/update"
import { CloseIcon, EditIcon, MailIcon, PhotoCameraIcon } from "@/icons"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { useCreateAttachment } from "@/lib/hooks/mutations/attachments/useCreateAttachment"
import { useUpdateProfile } from "@/lib/hooks/mutations/profile/useUpdateProfile"
import { cn, validateEmail } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { IconButton } from "@/components/iconButton"
import { Input } from "@/components/input"
import { MainButton } from "@/components/mainButton"
import {
  fontButtonLarge,
  fontButtonSmall,
  fontHeadline,
} from "@/styles/typography"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: {
    firstName: string
    lastName: string
    email: string
  }
}

const PUBLISH_IMAGE_URL = "https://www.publiish.io/ipfs/"

const getPublishImageUrl = (cid?: string) => {
  if (!cid) return ""
  return `${PUBLISH_IMAGE_URL}${cid}`
}

interface ValidationErrors {
  firstName: boolean
  lastName: boolean
  email: boolean
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { userId, user } = useAuth()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const { mutateAsync: createAttachment } = useCreateAttachment()
  const [errors, setErrors] = useState<ValidationErrors>({
    firstName: false,
    lastName: false,
    email: false,
  })

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName)
      setLastName(initialData.lastName)
      setEmail(initialData.email)
    }
  }, [initialData])

  if (!isOpen) return null

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImage(file)
    }
  }

  const validateField = (field: keyof ValidationErrors, value: string) => {
    switch (field) {
      case "email":
        return value.trim() !== "" && validateEmail(value.trim())
      default:
        return value.trim() !== ""
    }
  }

  const handleSave = async () => {
    if (!userId) return

    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const trimmedEmail = email.trim()

    const newErrors = {
      firstName: !validateField("firstName", trimmedFirstName),
      lastName: !validateField("lastName", trimmedLastName),
      email: !validateField("email", trimmedEmail),
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some((error) => error)) {
      return
    }

    const updateData: UpdateProfileBody = {
      user_id: userId,
      first_name: trimmedFirstName,
      last_name: trimmedLastName,
      email: trimmedEmail,
    }

    try {
      if (image) {
        const attachment = await createAttachment(
          {
            file: image,
            userId: userId,
          },
          {
            onError: (error) => {
              console.log(error.message)
              toast({
                title: "Failed to upload image",
                variant: "destructive",
              })
            },
          }
        )

        updateProfile(
          {
            ...updateData,
            picture: {
              cid: attachment.data.cid,
              type: "png",
              name: attachment.data.file,
            },
          },
          {
            onError: (error) => {
              console.log(error.message)
              toast({
                title: "Failed to update profile",
                variant: "destructive",
              })
            },
            onSuccess: async () => {
              setIsRefreshing(true)
              revalidateLayout()
              setIsRefreshing(false)
              onClose()
            },
          }
        )
      } else {
        updateProfile(updateData, {
          onSuccess: async () => {
            setIsRefreshing(true)
            revalidateLayout()
            setIsRefreshing(false)
            onClose()
          },
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-3 bg-white p-4 max-h-[90vh] overflow-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className={cn(fontHeadline, "text-black-100")}>Edit Profile</h3>
          <IconButton
            icon={CloseIcon}
            iconSize="24"
            size="large"
            variant="primaryWhite"
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-24 w-24 items-center justify-center">
              {user?.user_information.picture?.cid ? (
                <Image
                  src={image ? URL.createObjectURL(image) : getPublishImageUrl(user?.user_information.picture.cid)}
                  alt="Profile"
                  className="translate-x-1 translate-y-1 rounded-full bg-black-10 object-cover max-h-20 w-20 h-20"
                  width={80}
                  height={80}
                />
              ) : (
                <div
                  className={cn(
                    fontHeadline,
                    "flex h-[80px] w-[80px] translate-x-1 translate-y-1 items-center justify-center rounded-full bg-black-10 text-2xl text-black-100"
                  )}
                >
                  {user?.user_information.first_name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <button
              onClick={handleImageClick}
              className={cn(
                fontButtonSmall,
                "flex translate-y-1 items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-black-100 hover:bg-gray-200"
              )}
            >
              <PhotoCameraIcon className="h-5 w-5" />
              <span>Change Photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                setErrors((prev) => ({ ...prev, firstName: false }))
              }}
              extraStyles={cn(
                "w-full m-0",
                errors.firstName && "border-red-500"
              )}
              icon={EditIcon}
            />
            {errors.firstName && (
              <div className="pl-1 text-sm text-red-500">
                First name is required
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                setErrors((prev) => ({ ...prev, lastName: false }))
              }}
              extraStyles={cn(
                "w-full m-0",
                errors.lastName && "border-red-500"
              )}
              icon={EditIcon}
            />
            {errors.lastName && (
              <div className="pl-1 text-sm text-red-500">
                Last name is required
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: false }))
              }}
              extraStyles={cn("w-full m-0", errors.email && "border-red-500")}
              icon={MailIcon}
            />
            {errors.email && (
              <div className="pl-1 text-sm text-red-500">
                Please enter a valid email address
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex w-full items-center justify-center">
          <MainButton
            className={cn(fontButtonLarge, "w-full text-white-100")}
            variant="primary"
            onClick={handleSave}
            disabled={isPending || isRefreshing}
          >
            {isPending
              ? "Saving Changes..."
              : isRefreshing
                ? "Refreshing..."
                : "Save Changes"}
          </MainButton>
        </div>
      </div>
    </div>
  )
}
