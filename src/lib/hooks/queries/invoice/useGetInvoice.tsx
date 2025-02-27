import { getInvoice, GetInvoiceParams } from "@/api/invoice"
import { useQuery } from "@tanstack/react-query"

export const useGetInvoice = (params: GetInvoiceParams) => {
  return useQuery({
    queryKey: ["invoice", params.invoice_id],
    queryFn: () => getInvoice(params),
    enabled: !!params.invoice_id,
  })
}
