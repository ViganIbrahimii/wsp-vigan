import { Settings } from "@/types/interfaces/settings.interface"

import { apiRequest } from "../Api"

export interface GetSettingsParams {
  user_id: string
}

export interface GetSettingsResponse {
  data: Settings
}

export const getSettings = (params: GetSettingsParams) =>
  apiRequest<GetSettingsParams, GetSettingsResponse>({
    url: "/user-settings/read",
    method: "GET",
    params,
  })
