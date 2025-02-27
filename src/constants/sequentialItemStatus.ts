import { OrderStatuses } from "@/constants/orderStatuses"

export const sequentialItemStatuses: OrderStatuses[] = [
  OrderStatuses.ORDERED,
  OrderStatuses.ACCEPTED,
  OrderStatuses.READY,
  OrderStatuses.SERVED,
]
