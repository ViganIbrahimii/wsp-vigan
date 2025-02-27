import { Item } from "@/types/interfaces/item.interface"

import { apiRequest } from "../Api"

export interface GetItemParams {
  item_id?: string
}

export interface GetItemResponse extends Item {}

export const getItem = (params: GetItemParams) =>
  apiRequest<GetItemParams, GetItemResponse>({
    url: "/items/list",
    method: "GET",
    params,
  })
