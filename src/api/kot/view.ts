import { Kot } from "@/types/interfaces/kot.interface"

import { apiRequest } from "../Api"

export interface GetKotParams {
  kot_id: string
}

export interface GetKotResponse {
  data: Kot
}

export const getKot = (params: GetKotParams) =>
  apiRequest<GetKotParams, GetKotResponse>({
    url: "/kot/view",
    method: "GET",
    params,
  })
