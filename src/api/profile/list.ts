import { Profile } from "@/types/interfaces/profile.interface"

import { apiRequest } from "../Api"

export interface GetProfilesParams {
  brand_id?: string
  brand_type?: number
  name?: string
  email?: string
  phone?: string
  city?: string
  country?: string
  status?: string
  from_regdate?: string
  to_regdate?: string
  user_type?: string
  p1?: string
  p2?: string
  p3?: string
  p4?: string
  p5?: string
  user_id?: string
  per_page: number
  page: number
}

export interface GetProfilesResponse {
  data: Profile[]
  currentPage: number
  lastPage: number
  itemsPerPage: number
  pageItems: number
  total: number
}

export const getProfiles = (params: GetProfilesParams) =>
  apiRequest<GetProfilesParams, GetProfilesResponse>({
    url: "/profiles/list",
    method: "GET",
    params,
  })
