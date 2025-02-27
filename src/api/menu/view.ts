import { Menu } from "@/types/interfaces/menu.interface"

import { apiRequest } from "../Api"

export interface GetMenuParams {
  menu_id: string
}

export interface GetMenuResponse {
  data: Menu
}

export const getMenu = (params: GetMenuParams) =>
  apiRequest<GetMenuParams, GetMenuResponse>({
    url: "/menu/list",
    method: "GET",
    params,
  })
