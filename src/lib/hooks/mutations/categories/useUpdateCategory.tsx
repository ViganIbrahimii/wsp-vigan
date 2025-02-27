import { updateCategory, UpdateCategoryBody } from "@/api/categories/update"
import { useMutation } from "@tanstack/react-query"

export const useUpdateCategory = () =>
  useMutation({
    mutationFn: (data: UpdateCategoryBody) => updateCategory(data),
  })
