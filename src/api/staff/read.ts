import { Staff } from "@/types/interfaces/staff.interface"

import { apiRequest } from "../Api"

export interface GetStaffParams {
  staff_id: string
}

export interface GetStaffResponse {
  data: Staff
}

export const getStaff = (params: GetStaffParams) =>
  apiRequest<GetStaffParams, GetStaffResponse>({
    url: "/staffs/read",
    method: "GET",
    params,
  })
