import { getBrandTypes, GetBrandTypesParams } from "@/api/brand-types/list"
import { useQuery } from "@tanstack/react-query"

export const useGetBrandTypes = (params: GetBrandTypesParams) => {
  return useQuery({
    queryKey: ["brand-types"],
    queryFn: () => getBrandTypes(params),
  })
}
