import { getCombo, GetComboParams } from "@/api/combos"
import { useQuery } from "@tanstack/react-query"

export const useGetCombo = (params: GetComboParams) => {
  return useQuery({
    queryKey: ["combo", params.combo_id],
    queryFn: () => getCombo(params),
    enabled: !!params.combo_id,
  })
}
