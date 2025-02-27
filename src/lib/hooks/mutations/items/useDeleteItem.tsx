import { deleteItem, DeleteItemBody } from "@/api/items"
import { useMutation } from "@tanstack/react-query"

export const useDeleteItem = () =>
  useMutation({
    mutationFn: (data: DeleteItemBody) => deleteItem(data),
  })
