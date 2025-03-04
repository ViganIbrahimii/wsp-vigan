import { useState } from "react"
import { UpdateProfileBody } from "@/api/profile/update"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { useUpdateProfile } from "@/lib/hooks/mutations/profile/useUpdateProfile"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/input"
import { MainButton } from "@/components/mainButton"
import { fontHeadline } from "@/styles/typography"

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const { userId } = useAuth()

  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !userId) return

    const updateData: UpdateProfileBody = {
      user_id: userId,
      reset_password: 1,
      current_password: currentPassword,
      new_password: newPassword,
    }

    updateProfile(updateData, {
      onError: (error) => {
        console.log(error.message)
        toast({
          title: "Failed to change password",
          variant: "destructive",
        })
      },
      onSuccess: () => {
        setCurrentPassword("")
        setNewPassword("")
      },
    })
  }

  return (
    <section className="flex flex-col items-start justify-between gap-4 rounded-3 bg-white-60 px-4 py-6">
      <h3 className={cn(fontHeadline, "text-black-100")}>
        Password & Security
      </h3>

      <div className="flex w-full flex-col items-center justify-center gap-4 py-2">
        <Input
          placeholder={"Current Password"}
          extraStyles="w-full m-0"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
        />
        <Input
          placeholder={"New Password"}
          extraStyles="w-full m-0"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
        />
      </div>

      <div className="flex w-full items-center justify-center py-2">
        <MainButton
          className="w-full"
          variant="primary"
          onClick={handlePasswordChange}
          disabled={isPending || !currentPassword || !newPassword}
        >
          {isPending ? "Changing Password..." : "Change Password"}
        </MainButton>
      </div>
    </section>
  )
}
