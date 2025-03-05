"use client"

import React, { Dispatch, SetStateAction, useMemo, useState } from "react"
import { UnifiedCustomerInfo } from "@/api/orders/create"
import { OrderType } from "@/constants/orderTypes"
import {
  AddIcon,
  CloseIcon,
  HomeworkIcon,
  LocationIcon,
  MailIcon,
  PersonIcon,
  TextSnippetIcon,
} from "@/icons"

import { EnrichedOrderTypeOption } from "@/types/interfaces/order.interface"
import { useGetOrders } from "@/lib/hooks/queries/orders/useGetOrders"
import { cn, validateEmail } from "@/lib/utils"
import { countries } from "@/components/CountryList"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { IconButton } from "@/components/iconButton"
import IconWrapper from "@/components/iconWrapper"
import { Input } from "@/components/input"
import { MainButton } from "@/components/mainButton"
import { PhoneInput } from "@/components/phoneInput"
import SearchInputWithDropdown from "@/components/SearchInputWithDropdown"
import { fontCaptionBold, fontCaptionNormal } from "@/styles/typography"

import { OrderInfoInterface } from "../EditOrderModal"

const fieldConfigs = {
  [OrderType.DINE]: [
    {
      key: "first_name",
      placeholder: "First Name",
      isRequired: true,
      icon: PersonIcon,
    },
    {
      key: "last_name",
      placeholder: "Last Name",
      isRequired: true,
      icon: PersonIcon,
    },
    { key: "phone", placeholder: "Phone Number", isRequired: true, icon: null },
    { key: "email", placeholder: "Email", isRequired: true, icon: MailIcon },
  ],
  [OrderType.PICKUP]: [
    {
      key: "first_name",
      placeholder: "First Name",
      isRequired: true,
      icon: PersonIcon,
    },
    {
      key: "last_name",
      placeholder: "Last Name",
      isRequired: true,
      icon: PersonIcon,
    },
    { key: "phone", placeholder: "Phone Number", isRequired: true, icon: null },
    { key: "email", placeholder: "Email", isRequired: true, icon: MailIcon },
  ],
  [OrderType.DELIVERY]: [
    {
      key: "first_name",
      placeholder: "First Name",
      isRequired: true,
      icon: PersonIcon,
    },
    {
      key: "last_name",
      placeholder: "Last Name",
      isRequired: true,
      icon: PersonIcon,
    },
    { key: "phone", placeholder: "Phone Number", isRequired: true, icon: null },
    { key: "email", placeholder: "Email", isRequired: true, icon: MailIcon },
    {
      key: "address_1",
      placeholder: "Address Line 1",
      isRequired: true,
      icon: LocationIcon,
    },
    {
      key: "address_2",
      placeholder: "Apartment/Unit",
      isRequired: false,
      icon: HomeworkIcon,
    },
    {
      key: "orderInstruction",
      placeholder: "Order Instruction",
      isRequired: false,
      icon: TextSnippetIcon,
    },
  ],
}

const defaultGuestInfo: UnifiedCustomerInfo = {
  first_name: "",
  last_name: "",
  phone: "",
  phone_code: "",
  email: "",
  address_1: "",
  address_2: "",
  landmark: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  longitude: 0,
  latitude: 0,
}

interface GuestInfoDialogProps {
  serviceType: EnrichedOrderTypeOption | null
  orderInfo: OrderInfoInterface
  setOrderInfo: Dispatch<SetStateAction<OrderInfoInterface>>
  onSave: () => void
}

const GuestInfoDialog: React.FC<GuestInfoDialogProps> = ({
  serviceType,
  orderInfo,
  setOrderInfo,
  onSave,
}) => {
  const { guestInfo, orderInstruction } = orderInfo
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("US")
  const [tempGuestInfo, setTempGuestInfo] = useState<{
    guestInfo: UnifiedCustomerInfo
    orderInstruction: string
  }>({
    guestInfo: orderInfo.guestInfo || defaultGuestInfo,
    orderInstruction: orderInstruction || "",
  })
  const [selectedGuestInfo, setSelectedGuestInfo] = useState<{
    id: string
    guestInfo: UnifiedCustomerInfo
  }>({
    id: "",
    guestInfo: guestInfo || defaultGuestInfo,
  })
  const { data: ordersResponse } = useGetOrders({
    group_by: "user_id",
    search: searchQuery,
    page_limit: 100,
    page_size: 1,
  })
  const filteredUsers = useMemo(
    () =>
      ordersResponse?.data?.data?.map((order) => ({
        id: order.order_id,
        label1: order.customer?.first_name || "",
        label2: `${order.customer_phone_code} - ${order.customer_phone_number}`,
      })) || [],
    [ordersResponse]
  )

  const handleResultSelect = (orderId: string | number) => {
    const selectedOrder = ordersResponse?.data?.data?.find(
      (order) => order.order_id === orderId
    )

    const country = countries.find(
      (c) => c.dialCode === selectedOrder?.customer_phone_code
    )

    if (selectedOrder) {
      const guestInfo = {
        first_name: selectedOrder.customer?.first_name || "",
        last_name: selectedOrder.customer?.last_name || "",
        email: "",
        phone: selectedOrder.customer_phone_number || "",
        phone_code: selectedOrder.customer_phone_code || "",
        ...(serviceType?.value === OrderType.DELIVERY && {
          address_1: selectedOrder.customer_delivery_address || "",
          address_2: selectedOrder.customer_apartment || "",
        }),
      }
      setSelectedGuestInfo({
        id: selectedOrder.customer?.id || "",
        guestInfo,
      })
      setTempGuestInfo((prev) => ({
        ...prev,
        guestInfo,
      }))
      setSearchQuery(selectedOrder.customer?.first_name || "")
      setSelectedCountryCode(country?.code || "US")
    }
  }

  const validateFields = () => {
    const newErrors: Record<string, string> = {}
    const fields =
      serviceType?.value === OrderType.DELIVERY
        ? ["first_name", "last_name", "phone", "email", "address_1"]
        : ["first_name", "last_name", "phone", "email"]

    fields.forEach((key) => {
      if (!tempGuestInfo.guestInfo[key as keyof UnifiedCustomerInfo]) {
        newErrors[key] = `${key.replace(/_/g, " ")} is required`
      }
      if (
        key === "email" &&
        tempGuestInfo.guestInfo.email &&
        !validateEmail(tempGuestInfo.guestInfo.email)
      ) {
        newErrors[key] = "Please enter a valid email"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    const hasChanges = selectedGuestInfo.id
      ? Object.keys(tempGuestInfo.guestInfo).some((key) => {
          const originalValue =
            selectedGuestInfo.guestInfo[key as keyof UnifiedCustomerInfo]
          const currentValue =
            tempGuestInfo.guestInfo[key as keyof UnifiedCustomerInfo]
          return originalValue !== currentValue
        })
      : true

    if (hasChanges && !validateFields()) {
      return
    }

    setOrderInfo((prev) => ({
      ...prev,
      customerId: selectedGuestInfo.id,
      guestInfo: tempGuestInfo.guestInfo,
      orderInstruction: tempGuestInfo.orderInstruction,
      isNewCustomer: hasChanges,
    }))
    onSave()
    setOpen(false)
  }

  const renderInputs = () => {
    const fields = fieldConfigs[serviceType?.value || OrderType.DINE] || []

    return fields.map(({ key, placeholder, icon, isRequired }) => {
      const handleInputChange = (value: string) => {
        setTempGuestInfo((prev) => ({
          ...prev,
          ...(key !== "orderInstruction" && {
            guestInfo: { ...prev.guestInfo, [key]: value },
          }),
          ...(key === "orderInstruction" && { orderInstruction: value }),
        }))
      }

      return (
        <div key={key} className="flex flex-col gap-1">
          {key === "first_name" ? (
            <SearchInputWithDropdown
              icon={icon || PersonIcon}
              query={tempGuestInfo.guestInfo.first_name}
              setQuery={handleInputChange}
              results={filteredUsers}
              onResultSelect={handleResultSelect}
              placeholder={placeholder}
            />
          ) : key === "phone" ? (
            <PhoneInput
              value={tempGuestInfo.guestInfo.phone}
              dialCode={tempGuestInfo.guestInfo.phone_code}
              onChange={(value, Country) => {
                setTempGuestInfo((prev) => ({
                  ...prev,
                  guestInfo: {
                    ...prev.guestInfo,
                    phone: value,
                    phone_code: Country.dialCode,
                  },
                }))
                setSelectedCountryCode(Country.code)
              }}
              placeholder={placeholder}
              selectedCountryCode={selectedCountryCode}
            />
          ) : (
            <Input
              placeholder={placeholder}
              value={
                key === "orderInstruction"
                  ? tempGuestInfo.orderInstruction || ""
                  : tempGuestInfo.guestInfo[
                      key as keyof UnifiedCustomerInfo
                    ]?.toString() || ""
              }
              onChange={(e) => handleInputChange(e.target.value)}
              extraStyles="w-full"
              icon={icon || undefined}
            />
          )}
          {errors[key] && (
            <span className="text-sm text-red-500">{errors[key]}</span>
          )}
        </div>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div
          className={cn(
            "flex h-[48px] cursor-pointer items-center rounded-6 border border-black-10 bg-white-60 pr-4"
          )}
        >
          <div className="mr-2 flex h-[46px] min-w-[46px] items-center justify-center rounded-full bg-gray-100">
            <IconWrapper Component={PersonIcon} size={"20"} />
          </div>

          <div className="flex flex-col text-left">
            <span className={cn("text-black-60", fontCaptionNormal)}>
              Add Guest Info
            </span>
            {guestInfo && (
              <span className={cn("text-black-100", fontCaptionBold)}>
                {guestInfo.first_name} {guestInfo.last_name}
              </span>
            )}
          </div>

          <div className="ml-auto">
            <IconWrapper Component={AddIcon} size="20" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Add Guest Info</DialogTitle>
          <DialogClose asChild>
            <IconButton
              variant="primaryWhite"
              size="large"
              icon={CloseIcon}
              iconSize="24"
              isActive={true}
            />
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col gap-4">{renderInputs()}</div>
        <MainButton variant="primary" className="w-full" onClick={handleSave}>
          Save
        </MainButton>
      </DialogContent>
    </Dialog>
  )
}

export default GuestInfoDialog
