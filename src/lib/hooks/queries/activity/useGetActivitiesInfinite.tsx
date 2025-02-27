import { GetActivity, GetActivityParams } from "@/api/activity"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

export const useGetActivitiesInfinite = (
  params: Omit<GetActivityParams, "page_size">
) => {
  return useInfiniteQuery({
    queryKey: ["activities-infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await GetActivity({
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
