import { unstable_setRequestLocale } from "next-intl/server"

import KitchenDisplay from "@/components/KitchenDisplay"

interface KitchenDisplayProps {
  params: { locale: string }
}

export default function Page({ params }: KitchenDisplayProps) {
  return (
    <div className="w-full">
      <KitchenDisplay />
    </div>
  )
}
