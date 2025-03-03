import type { FC, SVGProps } from "react"
import { Command, Moon, SunMedium } from "lucide-react"

export type IconKeys = keyof typeof icons

type IconsType = {
  [key in IconKeys]: FC<SVGProps<SVGSVGElement>>
}

const icons = {
  logo: Command,
  sun: SunMedium,
  moon: Moon,
}

export const Icons: IconsType = icons
