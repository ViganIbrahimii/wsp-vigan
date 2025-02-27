import { getPaymentMethods, GetPaymentMethodsParams } from "@/api/payment-methods"
import { useQuery } from "@tanstack/react-query"

export const useGetPaymentMethods = (params: GetPaymentMethodsParams) => {
  return useQuery({
    queryKey: ["payment-methods", params],
    queryFn: () => getPaymentMethods(params),
  })
}
