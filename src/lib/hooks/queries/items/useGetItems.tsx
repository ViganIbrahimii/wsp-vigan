import { getItems, GetItemsParams } from "@/api/items"
import { useQuery } from "@tanstack/react-query"

export const useGetItems = (params: GetItemsParams) => {
  return useQuery({
    queryKey: ["items", params.category_id, params.menu_id],
    queryFn: () => getItems(params),
    enabled: !!params.category_id && params.category_id.length > 0,
  })
}
