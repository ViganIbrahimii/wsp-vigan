"use client"

import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { useGetPaymentDistributions } from "@/lib/hooks/queries/reports/useGetPaymentDistributions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Spinner from "@/components/spinner"

const colorMap: { [key: string]: string } = {
  Red: "rgb(255, 85, 45)",
  Taupe: "rgb(165, 135, 125)",
  Blue: "rgb(95, 95, 205)",
  Cyan: "rgb(85, 195, 215)",
  Yellow: "rgb(255, 195, 65)",
  Gray: "rgb(180, 180, 180)",
}

interface PaymentDistributionProps {
  startDate: string
  endDate: string
}

export function PaymentDistribution({
  startDate,
  endDate,
}: PaymentDistributionProps) {
  const { brandId } = useAuth()

  const { data: paymentData, isLoading } = useGetPaymentDistributions({
    entity_1_id: brandId || "",
    entity_1_type: "brand",
    start_date: startDate,
    end_date: endDate,
  })

  const chartData =
    paymentData?.data?.data?.map((item, index) => {
      const colorNames = Object.keys(colorMap)
      const colorIndex = index % colorNames.length
      const colorName = colorNames[colorIndex]
      return {
        name: item.payment_gateway,
        value: parseFloat(item.sum),
        currency: item.currency || "",
        color: colorMap[colorName],
      }
    }) || []

  const totalsByCurrency = chartData.reduce(
    (acc, item) => {
      if (!acc[item.currency]) {
        acc[item.currency] = 0
      }
      acc[item.currency] = +(acc[item.currency] + item.value).toFixed(2)
      return acc
    },
    {} as Record<string, number>
  )

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (isLoading) {
    return (
      <Card className="w-full rounded-3xl bg-black-5">
        <CardContent className="flex h-[32vh] items-center justify-center">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (!chartData.length || total === 0) {
    return (
      <Card className="w-full rounded-3xl bg-black-5">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-medium">
            Payment Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-[32vh] items-center justify-center">
          <span className="text-muted-foreground">No data available yet</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full rounded-3xl bg-black-5">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-medium">
          Payment Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="relative h-[32vh]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                {Object.entries(totalsByCurrency).map(([currency, amount]) => (
                  <div key={currency} className="text-xl font-semibold">
                    {currency} {amount.toLocaleString()}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
          <div className="flex h-[300px] flex-col justify-center space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex w-48 items-center gap-2">
                  <div
                    className="h-3 w-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium">
                  {item.currency} {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
