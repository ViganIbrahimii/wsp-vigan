import { updateOrderItem, UpdateOrderItemBody } from "@/api/order-items/update"
import { useMutation } from "@tanstack/react-query"

export const useUpdateOrderItem = () =>
  useMutation({
    mutationFn: (data: UpdateOrderItemBody) => updateOrderItem(data),
  })
