import { Metadata } from "next"

import LiveCounter from "@/components/LiveCounter/LiveCounter"

export const metadata: Metadata = {
  title: "Live Counter",
  description: "Real-time order tracking across different order types",
}

export default function LiveCounterPage() {
  return <LiveCounter />
}
