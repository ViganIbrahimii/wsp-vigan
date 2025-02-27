import { GetNotification, GetNotificationParams } from "@/api/notifications"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

export const useGetNotificationsInfinite = (
  params: Omit<GetNotificationParams, "page_size">
) => {
  return useInfiniteQuery({
    queryKey: ["notifications-infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await GetNotification({
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
    placeholderData: keepPreviousData,
  })
}
