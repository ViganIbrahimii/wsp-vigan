import {
  getBestSellers,
  GetBestSellersParams,
} from "@/api/reports/best-sellers"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useGetBestSellers = (params: GetBestSellersParams) => {
  return useQuery({
    queryKey: ["best-sellers", params],
    queryFn: () => getBestSellers(params),
    placeholderData: keepPreviousData,
    enabled: !!params.brand_id,
  })
}
