import { getSections, GetSectionsParams } from "@/api/sections/list"
import { useQuery } from "@tanstack/react-query"

export const useGetSections = (params: GetSectionsParams) => {
  return useQuery({
    queryKey: ["sections"],
    queryFn: () => getSections(params),
    // enabled: !!params.brand_id,
  })
}
