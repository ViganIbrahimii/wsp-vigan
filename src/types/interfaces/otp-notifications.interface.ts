export interface OtpNotification {
  id: number
  account_id: number
  interface_id: string
  service_provider_id: number
  otp_mode_id: number
  name: string
  picture: {
    cid: string
    type: string
    name: string
  }
  phone_number: string | null
  email: string | null
  otp_code: string
  status: "sent" | "verify"
  created_at: string
  expiry_at: string | null
  ip_address: string
  user_agent: string
  entity_1_id: string
  entity_1_type: string
  entity_2_id: string
  entity_2_type: string
  field_1_key: string //"previous_order_amount",
  field_1_value: string
  field_2_key: string //"previous_order_id",
  field_2_value: string
  field_3_key: string | null //"previous_brand_id",
  field_3_value: string | null
  field_4_key: string | null //"current_order_id",
  field_4_value: string | null
  field_5_key: string | null //cash_status
  field_5_value: "collected" | "deposited" | null
  field_6_key: string | null //brand_order_number
  field_6_value: string | null
  previous_brand_currency: string
}
