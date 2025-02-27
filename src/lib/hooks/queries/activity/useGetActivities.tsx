import { GetActivity, GetActivityParams } from "@/api/activity"
import { useQuery } from "@tanstack/react-query"

export const useGetActivity = (params: GetActivityParams) => {
  return useQuery({
    queryKey: ["activity", params.user_id],
    queryFn: () => GetActivity(params),
    enabled: !!params.user_id,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  })
}
