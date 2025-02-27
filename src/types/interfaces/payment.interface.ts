import { PaymentMethodStatus } from "@/api/payment-methods/list";

export interface PaymentMethodsListItem {
  payment_method_id: string;
  payment_method_name: string;
}

export interface PaymentMethod {
  id: string;
  payment_method: string;
  status: PaymentMethodStatus
}