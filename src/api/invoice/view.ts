import { Invoice } from "@/types/interfaces/invoice.interface"

import { apiRequest } from "../Api"

export interface GetInvoiceParams {
  invoice_id: string
}

export interface GetInvoiceResponse {
  data: Invoice
}

export const getInvoice = (params: GetInvoiceParams) =>
  apiRequest<GetInvoiceParams, GetInvoiceResponse>({
    url: "/invoice/view",
    method: "GET",
    params,
  })
