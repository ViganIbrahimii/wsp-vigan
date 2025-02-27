import { updateItem, UpdateItemBody } from "@/api/items/update"
import { useMutation } from "@tanstack/react-query"

export const useUpdateItem = () =>
  useMutation({
    mutationFn: (data: UpdateItemBody) => updateItem(data),
  })
