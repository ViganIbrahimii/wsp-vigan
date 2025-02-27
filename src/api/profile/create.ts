import { apiRequest } from "../Api"

export interface CreateProfileParams {
  first_name: string
  last_name: string
  phone_number: string
  phone_code: string
  email: string
  password: string
  confirm_password: string
  country: string
  birthday_date?: string
  user_type: string
  price_type?: string
  unit_price?: string
  referral_code?: string
  device_id?: string
  fcm_token?: string
  p1?: string
  p2?: string
  p3?: string
  p4?: string
  p5?: string
  tracking_id?: string
  latitude?: string
  longitude?: string
  collesction_radius?: string
}

export interface CreateProfileResponse {
  token: string
  expires_at: string
  user: {
    user_id: string
    price_type: string
    unit_price: string
    user_type: string
    referral_code: string
    device_id: string
    fcm_token: string
  }
}

export const createProfile = (params: CreateProfileParams) =>
  apiRequest<CreateProfileParams, CreateProfileParams>({
    url: "/profiles/create",
    method: "POST",
    params,
  })
