import { multipleDeleteOrder, MultipleDeleteOrderBody } from "@/api/orders"
import { useMutation } from "@tanstack/react-query"

export const useMultipleDeleteOrder = () =>
  useMutation({
    mutationFn: (data: MultipleDeleteOrderBody) => multipleDeleteOrder(data),
  })
