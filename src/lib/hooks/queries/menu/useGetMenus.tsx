import { getMenus, GetMenusParams } from "@/api/menu"
import { useQuery } from "@tanstack/react-query"

export const useGetMenus = (params: GetMenusParams) => {
  return useQuery({
    queryKey: ["menus", params.brand_id, params.service_type_id, params.search],
    queryFn: () => getMenus(params),
    enabled: !!params.brand_id,
  })
}
