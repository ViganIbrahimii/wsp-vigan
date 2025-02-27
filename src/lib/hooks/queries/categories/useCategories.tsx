import { getCategories, GetCategoriesParams } from "@/api/categories"
import { useQuery } from "@tanstack/react-query"

export const useGetCategories = (params: GetCategoriesParams) => {
  return useQuery({
    queryKey: ["categories", params.menu_id],
    queryFn: () => getCategories(params),
    enabled: !!params.menu_id,
  })
}
