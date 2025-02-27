import { getBrand, GetBrandParams } from "@/api/brand"
import { useQuery } from "@tanstack/react-query"

export const useGetBrand = (params: GetBrandParams) => {
  return useQuery({
    queryKey: ["brand", params.brand_id],
    queryFn: () => getBrand(params),
    enabled: !!params.brand_id,
  })
}
