import { getProfile, GetProfileParams } from "@/api/profile"
import { useQuery } from "@tanstack/react-query"

export const useGetProfile = (params: GetProfileParams) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getProfile(params),
    enabled: !!params.user_id,
  })
}
