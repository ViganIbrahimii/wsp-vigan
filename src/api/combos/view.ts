import { ComboDetail } from "@/types/interfaces/combo.interface"

import { apiRequest } from "../Api"

export interface GetComboParams {
  combo_id: string
}

export interface GetComboResponse {
  data: ComboDetail
}

export const getCombo = (params: GetComboParams) =>
  apiRequest<GetComboParams, GetComboResponse>({
    url: "/combo/view",
    method: "GET",
    params,
  })
