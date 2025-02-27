import { getItem, GetItemParams } from "@/api/items"
import { useQuery } from "@tanstack/react-query"

export const useGetItem = (params: GetItemParams) => {
  return useQuery({
    queryKey: ["item", params.item_id],
    queryFn: () => getItem(params),
    enabled: !!params.item_id,
  })
}
