import { useState } from "react"
import { UpdateProfileBody } from "@/api/profile/update"
import { defaultPageAfterLoginOptions } from "@/constants/defaultPageAfterLoginOptions"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"

import { useUpdateProfile } from "@/lib/hooks/mutations/profile/useUpdateProfile"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { MainButton } from "@/components/mainButton"
import { CustomSelect } from "@/components/select"
import { fontHeadline } from "@/styles/typography"

const pageOptions = [
  {
    label: "Kitchen Panel",
    value: defaultPageAfterLoginOptions.KITCHEN_PANEL,
  },
  { label: "Live Counter", value: defaultPageAfterLoginOptions.LIVE_COUNTER },
  { label: "Dashboard", value: defaultPageAfterLoginOptions.DASHBOARD },
  {
    label: "Order Status Screen",
    value: defaultPageAfterLoginOptions.ORDER_STATUS_SCREEN,
  },
  {
    label: "Menu Management",
    value: defaultPageAfterLoginOptions.MENU_MANAGEMENT,
  },
  {
    label: "OTP Confirmation",
    value: defaultPageAfterLoginOptions.OTP_CONFIRMATION,
  },
]

export default function DefaultPage() {
  const { user, userId } = useAuth()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const [selectedPage, setSelectedPage] =
    useState<defaultPageAfterLoginOptions>(
      (user?.performance_metrics
        .display_page_after_login as defaultPageAfterLoginOptions) ??
        defaultPageAfterLoginOptions.DASHBOARD
    )
  const [savedPage, setSavedPage] = useState<defaultPageAfterLoginOptions>(
    (user?.performance_metrics
      .display_page_after_login as defaultPageAfterLoginOptions) ??
      defaultPageAfterLoginOptions.DASHBOARD
  )

  const isPageChanged = selectedPage !== savedPage

  const handleSetDefault = () => {
    if (!userId || !selectedPage) return

    const updateData: UpdateProfileBody = {
      user_id: userId,
      default_page: selectedPage,
    }

    updateProfile(updateData, {
      onError: (error) => {
        console.log(error.message)
        toast({
          title: "Failed to set default page",
          variant: "destructive",
        })
      },
      onSuccess: () => {
        setSavedPage(selectedPage)
      },
    })
  }

  // Find the default option based on user's display_page_after_login
  const defaultOption = pageOptions.find(
    (option) =>
      option.value === user?.performance_metrics.display_page_after_login
  )

  const handleOptionSelect = (option: {
    value: defaultPageAfterLoginOptions
    label: string
  }) => {
    setSelectedPage(option.value)
  }

  return (
    <section className="flex flex-col items-start justify-between gap-4 rounded-3 bg-white-60 px-4 py-6">
      <h3 className={cn(fontHeadline, "text-black-100")}>
        Default Page After Login
      </h3>

      <div className="my-2 flex w-full items-center justify-center">
        <CustomSelect<defaultPageAfterLoginOptions>
          options={pageOptions}
          sortByText=""
          menuPosition="left"
          selectWidth="w-full"
          onOptionSelect={handleOptionSelect}
          defaultValue={defaultOption}
        />
      </div>

      <div className="my-2 flex w-full items-center justify-center">
        <MainButton
          className="w-full"
          variant="primary"
          onClick={handleSetDefault}
          disabled={isPending || !selectedPage || !isPageChanged}
        >
          {isPending ? "Saving..." : "Set as default"}
        </MainButton>
      </div>
    </section>
  )
}
