import { unstable_setRequestLocale } from "next-intl/server"

import LandingPage from "@/components/LandingPage/page"

interface KitchenDisplayProps {
  params: { locale: string }
}

export default function Page({ params }: KitchenDisplayProps) {
  return (
    <div className="w-full">
      <LandingPage />
    </div>
  )
}
