import {
  getServiceTypes,
  GetServiceTypesParams,
} from "@/api/service-types/list"
import { useQuery } from "@tanstack/react-query"

export const useGetServiceTypes = (params: GetServiceTypesParams) => {
  return useQuery({
    queryKey: ["serviceTypes", params.brand_type_id],
    queryFn: () => getServiceTypes(params),
    enabled: !!params.brand_type_id,
  })
}
