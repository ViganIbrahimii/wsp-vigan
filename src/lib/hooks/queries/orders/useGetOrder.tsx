import { getOrder, GetOrderParams } from "@/api/orders"
import { useQuery } from "@tanstack/react-query"

export const useGetOrder = (params: GetOrderParams) => {
  return useQuery({
    queryKey: ["order", params.order_id],
    queryFn: () => getOrder(params),
    enabled: !!params.order_id,
  })
}
