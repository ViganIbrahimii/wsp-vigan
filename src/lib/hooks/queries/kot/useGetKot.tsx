import { getKot, GetKotParams } from "@/api/kot"
import { useQuery } from "@tanstack/react-query"

export const useGetKot = (params: GetKotParams) => {
  return useQuery({
    queryKey: ["kot", params.kot_id],
    queryFn: () => getKot(params),
    enabled: !!params.kot_id,
  })
}
