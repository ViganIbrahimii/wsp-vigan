import { getItems, GetItemsParams } from "@/api/items"
import { getOrders, GetOrdersParams } from "@/api/orders"
import { useQuery } from "@tanstack/react-query"

export const useGetCategoryItems = (params: GetItemsParams) => {
  return useQuery({
    queryKey: ["categoryItems", params],
    queryFn: () => getItems(params),
  })
}
