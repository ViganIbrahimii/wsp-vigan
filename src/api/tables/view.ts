import { Table } from "@/types/interfaces/table.interface"

import { apiRequest } from "../Api"

export interface GetTableParams {
  table_id: string
}

export interface GetTableResponse {
  data: Table
}

export const getTable = (params: GetTableParams) =>
  apiRequest({
    url: `/tables/view/${params.table_id}`,
    method: "GET",
  })
