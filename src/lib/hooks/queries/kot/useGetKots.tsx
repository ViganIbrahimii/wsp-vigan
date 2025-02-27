import { getKots, GetKotsParams } from "@/api/kot"
import { useQuery } from "@tanstack/react-query"

export const useGetKots = (params: GetKotsParams) => {
  return useQuery({
    queryKey: ["kots"],
    queryFn: () => getKots(params),
    enabled: !!params.brand_id,
  })
}
