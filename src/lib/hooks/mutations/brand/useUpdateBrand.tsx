import { updateBrand, UpdateBrandBody } from "@/api/brand/update"
import { useMutation } from "@tanstack/react-query"

export const useUpdateBrand = () =>
  useMutation({
    mutationFn: (data: UpdateBrandBody) => updateBrand(data),
  })
