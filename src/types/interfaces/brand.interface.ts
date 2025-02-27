export interface Image {
  id: string
  cid: string
  type: string
  name: string
}

export interface Email {
  id: string
  value: string
}

export interface PhoneNumber {
  id: string
  code: string
  phone: string
  is_primary: boolean
}

export interface BasicDetails {
  name_of_brand: string
  slug: string
  description: string
  image: Image
  brand_images: Image[]
  user_id: string
}

export interface ContactInformation {
  email: Email
  phone_number: PhoneNumber[]
}

export interface CurrencySettings {
  currency_id: number
  currency: string
  visible_to_user: number
}

export interface BusinessIdentification {
  brand_type: string
  business_id: string
  cuisine_type: any[] // Adjust as needed
  google_business_id: string | null
  google_location_id: string | null
}

export interface GeneralInfo {
  basic_details: BasicDetails
  contact_information: ContactInformation
  currency_settings: CurrencySettings
  business_identification: BusinessIdentification
}

export interface GeneralSettings {
  status: string
  item_cancelable: boolean
  allow_quantity_change_from_main_menu: boolean
  work_status: string
}

export interface ServiceOptions {
  allow_pickup: boolean
  allow_delivery: boolean
  allow_dine_in: boolean
  allow_booking: boolean
  allow_booking_time: string | null
  max_no_of_guest: number
  allow_table_selection: boolean
}

export interface OrderManagement {
  merge_order: boolean
  enable_coupon_code: boolean
  make_customer_details_mandatory: any // Adjust as needed
  allow_manual_orders_after_closing_hours: boolean
  disable_orders: boolean
  guest_user_allowed: any[]
  customer_detail_for_service_panel: any[]
  show_item_code_for_customers: boolean
  show_payment_method: any[]
}

export interface DateFormat {
  id: string | null
  name: string
}

export interface CustomizationAndPreference {
  cms_custom_color: string | null
  allow_staff_change_their_password: boolean
  date_format: DateFormat
  time_zone: number
  time_slot_end_before_the_time_for_reservation_table: string
  online_orders_to_start_after_time_for_delivery_and_pickup: string
  online_orders_to_end_after_time_for_delivery_and_pickup: string
  bring_all_items_at_same_time: boolean
  delivery_dart: boolean
}

export interface TaxAndPricing {
  vat_percentage: number
  vat_included: boolean
}

export interface PaymentMethod {
  id: string
  name: string
}

export interface PaymentSettings {
  payment_methods: PaymentMethod[]
}

export interface FollowUpSequenceReviewSettings {
  review_setting: number
  options: string
  review_url: string[] // Adjust as needed
}

export interface NotificationSettings {
  sound_id: string
  name: string
  number_of_rings: number
  volume: number
}

export interface SystemSettings {
  system_printer: string | null
  printer_page_format: string | null
  shared_table_cart: boolean
  search_based_menu: boolean
}

export interface BrandSettings {
  general_settings: GeneralSettings
  service_options: ServiceOptions
  order_management: OrderManagement
  customization_and_preference: CustomizationAndPreference
  social_links: any[] // Adjust as needed
  tax_and_pricing: TaxAndPricing
  payment_settings: PaymentSettings
  follow_up_sequence_review_settings: FollowUpSequenceReviewSettings
  notification_settings: NotificationSettings
  system_settings: SystemSettings
}

export interface WorkingHours {
  id: string | null
  day_of_week: number
  status_of_day: boolean
  start_time: string
  end_time: string
}

export interface BrandWorkingHours {
  main_hours: WorkingHours[]
  alternative_hours: WorkingHours[]
}

export interface Location {
  country: { id: number; name: string }
  address_line_1: string | null
  address_line_2: string | null
  city: { id: number; name: string } | null
  post_code: string | null
  state: { id: number; name: string } | null
  latitude: number
  longitude: number
}

export interface Brand {
  brand_id: string
  general_info: GeneralInfo
  brand_setting: BrandSettings
  working_hours: BrandWorkingHours
  location: Location
  loyalty_limit_id: string
  qr_code_id: string | null
  created_at: string
}
