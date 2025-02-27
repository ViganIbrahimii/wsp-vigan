import { apiRequest } from "../Api"

export interface LoginBody {
  email: string
  password: string
  user_type: string
}

interface LoginData {
  brand_id: string
  token: string
  expires_at: string
  user: {
    user_id: number
    email: string
    name: string
    type: string
    role: string
  }
}

export interface LoginResponse {
  success: boolean
  data: LoginData
  message: string
}

export const login = (body: LoginBody) =>
  apiRequest<LoginBody, LoginResponse>({
    url: "/auth/login",
    method: "POST",
    data: body,
  })
