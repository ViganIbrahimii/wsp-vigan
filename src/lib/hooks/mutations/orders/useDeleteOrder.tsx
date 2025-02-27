import { deleteOrder, DeleteOrderBody } from "@/api/orders"
import { useMutation } from "@tanstack/react-query"

export const useDeleteOrder = () =>
  useMutation({
    mutationFn: (data: DeleteOrderBody) => deleteOrder(data),
  })
