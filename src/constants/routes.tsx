// routes.ts
import { FC, SVGProps } from "react"
import {
  BarChartIcon,
  LabProfileIcon,
  MenuManagementIcon,
  NotificationIcon,
  OrderDisplayIcon,
  OtpConfirmationIcon,
  PersonIcon,
  TableBarIcon,
} from "@/icons"

export type Route = {
  name: string
  href: string
  current: boolean
  icon: FC<SVGProps<SVGSVGElement>>
  includeLayout: boolean
  includeMainSidebar: boolean
  includeSecondarySidebar: boolean
  module: string
  hasBadge?: boolean
}

export const routes: Route[] = [
  {
    name: "Kitchen Display",
    href: "/",
    current: false,
    icon: LabProfileIcon,
    includeLayout: true,
    includeMainSidebar: true,
    includeSecondarySidebar: false,
    module: "Kitchen Panel",
  },
  {
    name: "Live Counter",
    href: "/live-counter",
    current: true,
    icon: TableBarIcon,
    includeLayout: true,
    includeMainSidebar: true,
    includeSecondarySidebar: false,
    module: "Live Counter",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    current: false,
    icon: BarChartIcon,
    includeLayout: true,
    includeMainSidebar: true,
    includeSecondarySidebar: false,
    module: "Dashboard",
  },
  {
    name: "Order Status",
    href: "/order-status",
    current: false,
    icon: OrderDisplayIcon,
    includeLayout: true,
    includeMainSidebar: true,
    includeSecondarySidebar: false,
    module: "Order Status",
  },
  {
    name: "Menu Management",
    href: "/menu-management",
    current: false,
    icon: MenuManagementIcon,
    includeLayout: true,
    includeMainSidebar: true,
    includeSecondarySidebar: false,
    module: "Menu Management",
  },
  {
    name: "OTP Confirmation",
    href: "/otp-confirmation",
    current: false,
    icon: OtpConfirmationIcon,
    includeLayout: true,
    includeMainSidebar: true,
    includeSecondarySidebar: false,
    module: "OTP Confirmation",
    hasBadge: true,
  },
  {
    name: "Profile",
    href: "/profile",
    current: false,
    icon: PersonIcon,
    includeLayout: true,
    includeMainSidebar: false,
    includeSecondarySidebar: true,
    module: "Profile",
  },
  {
    name: "Notifications",
    href: "/notifications",
    current: false,
    icon: NotificationIcon,
    includeLayout: true,
    includeMainSidebar: false,
    includeSecondarySidebar: true,
    module: "Notifications",
  },

  {
    name: "Login",
    href: "/login",
    current: false,
    icon: LabProfileIcon,
    includeLayout: false,
    includeMainSidebar: false,
    includeSecondarySidebar: false,
    module: "Login",
  },
]
