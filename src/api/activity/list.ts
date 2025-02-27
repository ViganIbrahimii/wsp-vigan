import { Activity } from "@/types/interfaces/activity.interface"

import { apiRequest } from "../Api"

export interface GetActivityParams {
  user_id: string
  page_limit: number
  page_size: number
  sort_by: "created_at" | null
  sort_order: "asc" | "desc"
  search: string
}

export interface GetActivityResponse {
  data: Activity[]
  current_page: number
  last_page: number
  total: number
  items_per_page: number
  page_items: number
}

export const GetActivity = (params: GetActivityParams) =>
  apiRequest<GetActivityParams, GetActivityResponse>({
    url: "/profile-activities/read",
    method: "GET",
    params,
  })
