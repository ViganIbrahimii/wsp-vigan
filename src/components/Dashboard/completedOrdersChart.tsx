"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface CompletedOrdersChartProps {
  startDate: string
  endDate: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
}

// Mock data for completed orders chart
const mockCompletedOrders = [
  { frequency: "Jan", orders: 120 },
  { frequency: "Feb", orders: 150 },
  { frequency: "Mar", orders: 180 },
  { frequency: "Apr", orders: 210 },
  { frequency: "May", orders: 240 },
  { frequency: "Jun", orders: 270 },
  { frequency: "Jul", orders: 300 },
  { frequency: "Aug", orders: 330 },
  { frequency: "Sep", orders: 360 },
  { frequency: "Oct", orders: 390 },
  { frequency: "Nov", orders: 420 },
  { frequency: "Dec", orders: 450 },
]

export function CompletedOrdersChart({
  startDate,
  endDate,
  frequency,
}: CompletedOrdersChartProps) {
  // Using mock data instead of API call
  const chartData = mockCompletedOrders

  const maxValue = Math.max(...chartData.map((d) => d.orders))

  if (!chartData.length) {
    return (
      <Card className="rounded-3xl bg-black-5 pb-0">
        <CardHeader>
          <CardTitle>Completed Orders</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[30vh] items-center justify-center text-muted-foreground">
          No data available yet
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-3xl bg-black-5 pb-0">
      <CardHeader>
        <CardTitle>Completed Orders</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig} className="h-[30vh] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <defs>
              <pattern
                id="striped-pattern"
                width="8"
                height="4"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="4" height="4" fill="rgba(0, 0, 0, 0.05)" />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="frequency" axisLine={false} tick={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value: any) => [value, ""]}
                  className="!min-h-0 !min-w-0 bg-black p-2 text-white [&_*]:text-white"
                />
              }
            />
            <YAxis domain={[0, "dataMax"]} hide />
            <Bar
              dataKey="orders"
              radius={[50, 50, 50, 50]}
              background={({ x, y, width, height }: any) => (
                <>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={50}
                    fill="rgba(0, 0, 0, 0.05)"
                  />
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={50}
                    fill="url(#striped-pattern)"
                  />
                </>
              )}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.orders === maxValue
                      ? "var(--brand-background)"
                      : "white"
                  }
                />
              ))}
              <LabelList
                dataKey="frequency"
                position="insideBottom"
                className="fill-foreground"
                content={({ x, y, value, height, width }: any) => {
                  const isMax =
                    chartData.find((d) => d.frequency === value)?.orders ===
                    maxValue

                  const circleSize = Math.min(width * 0.8, 60)
                  const xOffset = (width - circleSize) / 2

                  return (
                    <foreignObject
                      x={x! + xOffset}
                      y={height + y - (circleSize + 10)}
                      width={circleSize}
                      height={circleSize}
                    >
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-full text-center ${
                          isMax
                            ? "bg-white-100 text-black-100"
                            : "bg-black-10 text-[var(--foreground)]"
                        }`}
                      >
                        {value}
                      </div>
                    </foreignObject>
                  )
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
