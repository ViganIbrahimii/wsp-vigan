import { editSettings, EditSettingsBody } from "@/api/settings"
import { useMutation } from "@tanstack/react-query"

export const useEditSettings = () =>
  useMutation({
    mutationFn: (data: EditSettingsBody) => editSettings(data),
  })
