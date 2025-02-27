import { getCombos, GetCombosParams } from "@/api/combos"
import { useQuery } from "@tanstack/react-query"

export const useGetCombos = (params: GetCombosParams) => {
  return useQuery({
    queryKey: ["combos"],
    queryFn: () => getCombos(params),
    enabled: !!params.brand_id,
  })
}
