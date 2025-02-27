import { getMenu, GetMenuParams } from "@/api/menu"
import { useQuery } from "@tanstack/react-query"

export const useGetMenu = (params: GetMenuParams) => {
  return useQuery({
    queryKey: ["menu", params.menu_id],
    queryFn: () => getMenu(params),
    enabled: !!params.menu_id,
  })
}
