import { updateOrder, UpdateOrderBody } from "@/api/orders"
import { useMutation } from "@tanstack/react-query"

export const useUpdateOrder = () =>
  useMutation({
    mutationFn: (data: UpdateOrderBody) => updateOrder(data),
  })
