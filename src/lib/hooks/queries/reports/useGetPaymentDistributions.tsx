import {
  getPaymentDistributions,
  GetPaymentDistributionsParams,
} from "@/api/reports/payment-distributions"
import { useQuery } from "@tanstack/react-query"

export const useGetPaymentDistributions = (
  params: GetPaymentDistributionsParams
) => {
  return useQuery({
    queryKey: ["payment-distributions", params],
    queryFn: () => getPaymentDistributions(params),
    enabled: !!params.entity_1_id,
  })
}
