interface ImageType {
  cid: string
  type: string
  name: string
}

export interface Profile {
  user_information: {
    first_name: string
    last_name: string
    email: string
    phone_code: string
    phone_no: string
    country_code: string
    photo_url: string
    user_type: string
    status: string
    verification_status: boolean
    total_reviews: number
    total_active_rider: number
    picture: ImageType
  }
  localtion_information: {
    latitude: string
    longitude: string
    collection_radius: string
    user_address: string
  }
  pricing_information: {
    price_type: string
    unit_price: string
    currency: string
  }
  refferal_codes: {
    p1: string
    p2: string
    p3: string
    p4: string
    p5: string
    tracking_id: string
  }
  performance_metrics: {
    rating: number
    total_trips: number
    daily_earning: number
    display_page_after_login: string
    doj: string
  }
  role_id: string
  // TODO: Add type definition for notification
  notification: []
}

export interface ProfileListParams {
  // Basic info
  name?: string
  email?: string
  phone?: string
  country?: string

  // Status can only be specific values
  status?: "active" | "inactive" | "suspended" | "deleted"

  // Date range filters
  from_regdate?: string // date format
  to_regdate?: string // date format

  // User type enum
  user_type?:
    | "brand_owner"
    | "customer"
    | "driver"
    | "fleet_manager"
    | "staff"
    | "admin"
    | "service_panel"

  // Custom parameters
  p1?: string
  p2?: string
  p3?: string
  p4?: string
  p5?: string

  // User identification
  user_id?: string
  referral_code?: string
  referred_by?: string

  // Pagination
  page_limit?: number // default: 15
  page_size?: number // default: 1
}

interface ProfileAddress {
  address_identifier: string
  address_1: string
  address_2: string
  address_3: string
  city: number
  post_code: string
  state: number
  country: number
  latitude: string
  longitude: string
}

interface ProfileImage {
  cid: string
  type: string
  filename: string
}

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  country: string
  entity_type: string
  entity_id: string
  default_address: boolean
  address: ProfileAddress[]
  type: string
  status: string
  created_at: string
  profile_image: ProfileImage
}

export interface ProfileListResponse {
  success: boolean
  message: string
  data: ProfileData[]
  current_page: number
  last_page: number
  items_per_page: number
  page_items: number
  total: number
  timestamp: string
  execution_time: string
  cached: boolean
}
