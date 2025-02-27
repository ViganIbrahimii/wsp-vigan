"use client"

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { clearCookies, redirectFunction } from "@/actions/auth"
import { SERVICE_TYPE_CONFIG, ServiceType } from "@/constants/serviceTypes"
import { useRouter } from "@/i18n/routing"

import { Brand, ServiceOptions } from "@/types/interfaces/brand.interface"
import { Profile } from "@/types/interfaces/profile.interface"

interface AvailableServiceType {
  allowKey: string
  label: string
  value: ServiceType
}

interface AuthContextProps {
  authToken: string | null
  userId: string | null
  brandId: string | null
  user: Profile | null
  brand: Brand | null
  logout: () => void // Add logout function to the context
  availableServiceTypes: AvailableServiceType[]
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({
  children,
  authToken,
  userId,
  brandId,
  user,
  brand,
}: {
  children: ReactNode
  authToken: string | null
  brandId: string | null
  userId: string | null
  user: Profile | null
  brand: Brand | null
}) => {
  const router = useRouter()

  const logout = async () => {
    try {
      // Call server action to clear cookies
      localStorage.removeItem("authToken")
      await clearCookies()

      // Clear local storage

      redirectFunction("/login")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const extractAvailableServiceTypes = (brand: Brand | null) => {
    if (!brand) return []

    const serviceOptions = brand.brand_setting?.service_options
    
    return Object.entries(SERVICE_TYPE_CONFIG)
      .filter(
        ([_, { allowKey }]) =>
          serviceOptions?.[allowKey as keyof ServiceOptions]
      )
      .map(([type, config]) => ({
        ...config, // Spread existing config (label, allowKey)
        value: type as ServiceType, // Add the service type value
      }))
  }

  const [authState, setAuthState] = useState<AuthContextProps>({
    authToken,
    brandId,
    userId,
    user,
    brand,
    logout,
    availableServiceTypes: extractAvailableServiceTypes(brand),
  })

  useEffect(() => {
    // If localStorage isn't set properly, update it

    localStorage.setItem("authToken", authToken || "")
  }, [authToken, brandId, user, brand])

  return (
    <AuthContext.Provider
      value={{
        authToken,
        brandId,
        userId,
        user,
        brand,
        logout,
        availableServiceTypes: extractAvailableServiceTypes(brand),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
