import { getRole, GetRoleParams } from "@/api/role/read"
import { useQuery } from "@tanstack/react-query"

export const useGetRole = (params: GetRoleParams) => {
  return useQuery({
    queryKey: ["role", params.role_id],
    queryFn: () => getRole(params),
    enabled: !!params.role_id,
  })
}
