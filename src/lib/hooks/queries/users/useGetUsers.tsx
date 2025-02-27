import { getUsers } from "@/api/users"
import { useQuery } from "@tanstack/react-query"

import { ProfileListParams } from "@/types/interfaces/profile.interface"

export const useGetUsers = (params: ProfileListParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  })
}
