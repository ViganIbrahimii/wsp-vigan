import { apiRequest } from "../Api"

export interface GetRoleParams {
  role_id: string
  masterModule?: boolean
}

export interface GetRoleResponse {
  data: Role
}

export interface Role {
  role_id: string
  brand_id: number
  name: string
  project_id: number
  component_id: string
  module_id: string
  section_id: string
  interface_id: string
  create_flag: number
  update_flag: number
  delete_flag: number
  is_active: number
  seeded: number
}

export const getRole = (params: GetRoleParams) =>
  apiRequest<GetRoleParams, GetRoleResponse>({
    url: "/roles/read",
    method: "GET",
    params,
    masterModule: true,
  })
