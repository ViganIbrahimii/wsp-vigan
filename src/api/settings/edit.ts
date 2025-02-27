import { Settings } from "@/types/interfaces/settings.interface"

import { apiRequest } from "../Api"

export interface EditSettingsBody {
  user_id: string
  banner_and_sound: boolean
  banner_only: boolean
  sound_only: boolean
  none: boolean
  play_repeated: boolean
  table_notification: boolean
  order_notification: boolean
}

export interface EditSettingsResponse {
  data: Settings
}

export const editSettings = (body: EditSettingsBody) =>
  apiRequest<EditSettingsBody, EditSettingsResponse>({
    url: "/user-settings/update",
    method: "PUT",
    data: body,
  })
