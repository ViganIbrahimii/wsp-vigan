import { getTable, GetTableParams } from "@/api/tables"
import { useQuery } from "@tanstack/react-query"

export const useGetTable = (params: GetTableParams) => {
  return useQuery({
    queryKey: ["table", params.table_id],
    queryFn: () => getTable(params),
    enabled: !!params.table_id,
  })
}
