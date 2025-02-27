import { createOrder, CreateOrderBody } from "@/api/orders/create"
import { useMutation } from "@tanstack/react-query"

export const useCreateOrder = () =>
  useMutation({
    mutationFn: (data: CreateOrderBody) => createOrder(data),
  })
