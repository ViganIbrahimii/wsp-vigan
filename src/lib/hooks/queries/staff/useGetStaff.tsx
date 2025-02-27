import { getStaff, GetStaffParams } from "@/api/staff"
import { useQuery } from "@tanstack/react-query"

export const useGetStaff = (params: GetStaffParams) => {
  return useQuery({
    queryKey: ["staffs", params.staff_id],
    queryFn: () => getStaff(params),
    enabled: !!params.staff_id,
  })
}
