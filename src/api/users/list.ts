import {
  ProfileListParams,
  ProfileListResponse,
} from "@/types/interfaces/profile.interface"

import { apiRequest } from "../Api"

export const getUsers = (params: ProfileListParams) =>
  apiRequest<ProfileListParams, ProfileListResponse>({
    url: "/users/list",
    method: "GET",
    params,
  })
