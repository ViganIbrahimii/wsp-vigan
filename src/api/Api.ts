import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"

import { env } from "@/env.mjs"
import { getFromLocalStorage } from "@/lib/helpers"

export interface AxiosRequestOptions<D> extends AxiosRequestConfig<D> {
  excludeAuthentication?: boolean
  headers?: any
  masterModule?: boolean
  smoothSwipe?: boolean
  internetCash?: boolean
}

export async function apiRequest<D = {}, R = unknown>({
  url,
  method,
  data,
  headers = {}, // Default to empty object
  params,
  responseType,
  masterModule = false,
  smoothSwipe = false,
  internetCash = false,
}: AxiosRequestOptions<D>) {
  // Create a headers object with the necessary CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  }

  // Merge the custom headers and CORS headers

  const token = getFromLocalStorage("authToken")

  // Merge headers: Prioritize passed headers, add Authorization if not explicitly set
  const mergedHeaders = {
    ...corsHeaders,
    ...headers, // Respect headers passed as arguments
    ...(token && !headers.Authorization
      ? { Authorization: `Bearer ${token}` }
      : {}),
  }

  const baseUrlMap = {
    smoothSwipe: `${env.NEXT_PUBLIC_SMOOTH_SWIPE_URL}/api/v2.0.0`,
    masterModule: `${env.NEXT_PUBLIC_MASTERMODULES_URL}/api/v2.0.0`,
    internetCash: `${env.NEXT_PUBLIC_INTERNETCASH_URL}/api/v2.0.0`,
    default: `${env.NEXT_PUBLIC_API_URL}/api/v2.0.0`,
  }

  // Choose base URL based on mastermodule and smoothSwipe flags
  let baseUrl = baseUrlMap.default

  if (smoothSwipe) {
    baseUrl = baseUrlMap.smoothSwipe
  } else if (masterModule) {
    baseUrl = baseUrlMap.masterModule
  } else if (internetCash) {
    baseUrl = baseUrlMap.internetCash
  }

  return await Axios.request<D, AxiosResponse<R>>({
    url: `${baseUrl}${url}`,
    method,
    data,
    headers: mergedHeaders,
    params,
    responseType,
  })
}
