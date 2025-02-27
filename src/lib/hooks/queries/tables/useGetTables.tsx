import { getTables, GetTablesParams } from "@/api/tables"
import { useQuery } from "@tanstack/react-query"

export const useGetTables = (params: GetTablesParams) => {
  return useQuery({
    queryKey: ["tables", params],
    queryFn: () => getTables(params),
    enabled: !!params.brand_id,
  })
}
