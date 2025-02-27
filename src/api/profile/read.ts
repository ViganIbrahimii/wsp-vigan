import { Profile } from "@/types/interfaces/profile.interface"

import { apiRequest } from "../Api"

export interface GetProfileParams {
  user_id: string
}

export interface GetProfileResponse {
  success: boolean
  data: Profile
  message: string
  timestamp: string
  execution_time: string
  cached: boolean
}

export const getProfile = (
  params: GetProfileParams,
  headers?: { Authorization: string }
) =>
  apiRequest<GetProfileParams, GetProfileResponse>({
    url: "/profiles/read",
    method: "GET",
    params,
    headers,
  })
