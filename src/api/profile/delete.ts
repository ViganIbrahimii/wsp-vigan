import { Profile } from "@/types/interfaces/profile.interface"

import { apiRequest } from "../Api"

export interface DeleteProfileParams {
  user_id: string
}

export interface DeleteProfileResponse {
  data: Profile
}

export const deleteProfile = (params: DeleteProfileParams) =>
  apiRequest<DeleteProfileParams, DeleteProfileParams>({
    url: "/profiles/delete",
    method: "DELETE",
    params,
  })
