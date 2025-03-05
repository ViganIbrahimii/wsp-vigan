"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import Spinner from "@/components/spinner"
import { fontCaptionBold } from "@/styles/typography"

interface MenuItem {
  name: string
  orderCount: number
}

interface PopularItemsProps {
  startDate: string
  endDate: string
}

// Mock data for popular items
const mockPopularItems = [
  { name: "Chicken Burger", orderCount: 45 },
  { name: "Cheese Pizza", orderCount: 38 },
  { name: "Veggie Wrap", orderCount: 32 },
  { name: "French Fries", orderCount: 30 },
  { name: "Chocolate Shake", orderCount: 28 },
  { name: "Caesar Salad", orderCount: 25 },
  { name: "Grilled Salmon", orderCount: 22 },
  { name: "Pasta Carbonara", orderCount: 20 },
  { name: "Steak Sandwich", orderCount: 18 },
  { name: "Ice Cream Sundae", orderCount: 15 },
]

export function PopularItems({ startDate, endDate }: PopularItemsProps) {
  // Using mock data instead of API call
  const menuItems: MenuItem[] = mockPopularItems

  return (
    <div className="flex h-full flex-col rounded-3xl bg-black-5 p-6">
      <h2 className="mb-4 text-xl font-semibold">Popular Items</h2>
      {menuItems.length === 0 ? (
        <CardContent className="flex h-[32vh] items-center justify-center">
          <span className="text-muted-foreground">No data available yet</span>
        </CardContent>
      ) : (
        <div className="grid flex-grow grid-cols-2 gap-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex h-full flex-col justify-between rounded-2xl bg-white-60 p-4 shadow-sm"
            >
              <h3 className="text-base font-medium">{item.name}</h3>
              <p className="mt-2 text-sm text-gray-500">
                Order:{" "}
                <span className={cn(fontCaptionBold, "text-black-100")}>
                  {item.orderCount}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
