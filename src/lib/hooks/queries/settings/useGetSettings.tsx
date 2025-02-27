import { getSettings, GetSettingsParams } from "@/api/settings"
import { useQuery } from "@tanstack/react-query"

export const useGetSettings = (params: GetSettingsParams) => {
  return useQuery({
    queryKey: ["settings", params.user_id],
    queryFn: () => getSettings(params),
    enabled: !!params.user_id,
  })
}
