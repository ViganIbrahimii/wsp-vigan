import { updateProfile, UpdateProfileBody } from "@/api/profile/update"
import { useMutation } from "@tanstack/react-query"

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (data: UpdateProfileBody) => updateProfile(data),
  })
