import { defaultPageAfterLoginOptions } from "@/constants/defaultPageAfterLoginOptions"

import { apiRequest } from "../Api"

export interface UpdateProfileBody {
  user_id: string
  brand_id?: string
  brand_type?: number
  first_name?: string
  last_name?: string
  email?: string
  phone_code?: string
  phone?: string
  city?: string
  default_page?: string
  country?: string
  reset_password?: number
  current_password?: string
  new_password?: string
  password_confirmation?: string
  status?: string
  price_type?: number
  unit_price?: number
  share_mode?: string
  picture?: {
    cid: string
    type: string
    name: string
  }
  latitude?: number
  longitude?: number
  commission_riders?: string
  commission_friends?: string
  commission_restaurant?: string
  referrals_riders?: number
  referrals_friends?: number
  referrals_restaurant?: number
  email_verified?: boolean
  rating?: number
  total_trip?: number
  deleted?: boolean
  collection_radius?: number
  user_type?: string
  fleet_size?: number
  user_bio?: string
  dob?: string
  score?: number
  rank?: number
  location?: string
  currency?: string
  go_online?: boolean
  profile_visibility?: boolean
  post_visibility?: boolean
  friend_list_visibility?: boolean
  message_visibility?: boolean
  search_visibility?: boolean
  last_seen_visibility?: boolean
  read_receipts_visibility?: boolean
  activity_status_visibility?: boolean
  display_page_after_login?: defaultPageAfterLoginOptions
}

export interface EditProfileResponse {
  data: {
    user_id: string
    Brnads: {
      brand_id: string
      brand_type: string
    }
    first_name: string
    last_name: string
    email: string
    phone_code: string
    phone: string
    country: string
    status: string
    price_type: {
      id: string
      name: string
      type: string
    }
    unit_price: number
    share_mode: string
    picture: {
      cid: string
      type: string
      name: string
    }
    latitude: number
    longitude: number
    rating: number
    collection_radius: number
    user_type: string
    dob: string
    score: number
    rank: number
    location: string
    currency: string
    default_page: string
    device_id: string
    go_online: boolean
    fleet_manager_code: string
    fcm_token: string
    preferences: {
      id: string
      user_id: string
      profile_visibility: boolean
      post_visibility: boolean
      friend_list_visibility: boolean
      message_visibility: boolean
      search_visibility: boolean
      last_seen_visibility: boolean
      read_receipts_visibility: boolean
      activity_status_visibility: boolean
      banner_and_sound: boolean
      banner_only: boolean
      sound_only: boolean
      play_repeated: boolean
      table_notification: boolean
      order_notification: boolean
    }
    referral_qr_image: {
      id: string
      cid: string
      type: string
      name: string
    }
    role_id: string
    brand_id: string
    staff_working_hours: Array<{
      day_of_week: string
      status_of_day: boolean
      start_time: string
      end_time: string
    }>
  }
}

export const updateProfile = (body: UpdateProfileBody) =>
  apiRequest<UpdateProfileBody, EditProfileResponse>({
    url: `/profiles/update`,
    method: "PUT",
    data: body,
  })
