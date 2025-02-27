import {
  getOtpNotifications,
  GetOtpNotificationsParams,
} from "@/api/otp-notifications/list"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

export const useGetOtpNotificationsInfinite = (
  params: Omit<GetOtpNotificationsParams, "page_size">
) => {
  return useInfiniteQuery({
    queryKey: ["otp-notifications", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getOtpNotifications({
        ...params,
        page_size: pageParam,
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.current_page < lastPage.last_page
        ? lastPage.current_page + 1
        : undefined
    },
    initialPageParam: 1,
    // placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}
