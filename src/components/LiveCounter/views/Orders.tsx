"use client"

import { useState } from "react"
import { useAuth } from "@/providers/AuthProvider/AuthProvider"
import { GridIcon, LayoutGrid } from "lucide-react"
import Masonry from "react-masonry-css"

import { IconButton } from "@/components/iconButton"
import { LiveCounterOrderCard } from "@/components/liveCounterOrderCard"
import { Tab } from "@/components/tab"
import { breakpointColumnsObj } from "@/styles/columnBreakpoints"

import { breakpointSmallViewColumnsObj } from "../../../styles/columnBreakpoints"
import { useGetOrders } from "@/lib/hooks/queries/orders/useGetOrders"
import { OrderType } from "@/constants/orderTypes"
import { GetOrdersParams } from "@/api/orders"

interface OrdersComponentProps {
  pageType: "DELIVERY" | "PICKUP" | "AGGREGATORS"
}

export default function OrdersComponent({ pageType }: OrdersComponentProps) {
  const { brandId } = useAuth()

  const getOrderType = () => {
    if (pageType === "DELIVERY")
      return OrderType.DELIVERY
    else if (pageType === "PICKUP")
      return OrderType.PICKUP
    else if (pageType === "AGGREGATORS")
      return OrderType.AGGREGATOR
    return OrderType.DELIVERY
  }

  const {
    data: orderQueryData,
    error: orderQueryError,
    isLoading: orderQueryLoading
  } = useGetOrders({
    page_size: 400,
    page_number: 1,
    order_type: getOrderType(),
    search: "",
  } as GetOrdersParams)

  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const [isSmallIconView, setIsSmallIconView] = useState(false)

  const openOrdersStatus = new Set(["ordered", "accepted", "ready", "advanced"])
  const completedOrdersStatus = new Set(["canceled", "closed", "served"])

  const subTabs = ["Open Orders", "Completed"]

  const options = [
    { value: "order-no-ascending", label: "Order No. Ascending" },
    { value: "order-no-descending", label: "Order No. Descending" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-fit rounded-6 bg-white-60">
          {subTabs.map((tabItem, index) => {
            return (
              <Tab
                variant="secondary"
                key={`table-position-${index}`}
                isActive={selectedTabIndex === index}
                onClick={() => {
                  setSelectedTabIndex(index)
                }}
              >
                {tabItem}
              </Tab>
            )
          })}
        </div>
        <div className="flex items-center gap-4">
          {/* <CustomSelect options={options} sortByText="Sort by:" /> */}
          <IconButton
            icon={isSmallIconView ? GridIcon : LayoutGrid}
            iconSize="24"
            size="large"
            variant={"transparent"}
            onClick={() => {
              setIsSmallIconView(!isSmallIconView)
            }}
          />
        </div>
      </div>
      <div>
        <Masonry
          breakpointCols={
            isSmallIconView
              ? breakpointSmallViewColumnsObj
              : breakpointColumnsObj
          }
          className="-ml-4 flex w-auto"
          columnClassName="pl-4 bg-clip-padding py-4"
        >
          {selectedTabIndex === 0
            ? dummyTables
              .filter((table) => openOrdersStatus.has(table?.order_status))
              .map((table, index) => (
                <div key={index} className="mb-4">
                  <LiveCounterOrderCard
                    key={index}
                    order_number={table.order_number}
                    order_status={table.order_status}
                    customer_name={table.customer.name}
                    payment_status={table.payment_status}
                    isSmallIconView={isSmallIconView}
                    time={table.time}
                  />
                </div>
              ))
            : dummyTables
              .filter((table) =>
                completedOrdersStatus.has(table?.order_status)
              )
              .map((table, index) => (
                <div key={index} className="mb-4">
                  <LiveCounterOrderCard
                    key={index}
                    order_number={table.order_number}
                    order_status={table.order_status}
                    customer_name={table.customer.name}
                    payment_status={table.payment_status ?? ""}
                    isSmallIconView={isSmallIconView}
                    time={table.time}
                  />
                </div>
              ))}
        </Masonry>
      </div>
    </div>
  )
}

//dummy data, will remove after api finished
const dummyTables: any[] = [
  {
    order_number: 465,
    customer_delivery_address: "chennai",
    customer_phone_code: "+91",
    customer_phone_number: "8787563211",
    customer_image: "https://wwww/images.jpeg",
    order_instruction: "Some instruction",
    order_id: "01aab017-f419-400b-9a11-6d7a4ad43ecd",
    customer: {
      id: "cacb121e-28be-11ec-9621-0242ac130002",
      name: "John Doe",
      latitude: "13.08268020",
      longitude: "20.08268020",
    },
    table: {
      id: "01ccb017-f419-400b-9a11-6d7a4ad43ecd",
      name: "Table 1",
    },
    date: "2023-02-17",
    time: "16:02:19",
    items_count: 2,
    item_details: [
      {
        id: "01ddb017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 1",
      },
      {
        id: "01ee017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 2",
      },
    ],
    amount: 100.5,
    payment_status: "paid",
    order_status: "ordered",
    brand_details: {
      id: "e3caeeb0-b57b-4306-9bcd-80104d9d26e1",
      name: "Hotel King A",
      location: "Chennai",
      latitude: "13.08268020",
      longitude: "80.27071840",
      email: "hotelkinga@gmail.com",
      currency: "VEF",
    },
    delivery_fee: 100,
    cancelled_reason: "some reason if added",
    delivery_status: "delivered",
    customer_rating: 4.5,
  },
  {
    order_number: 1104,
    customer_delivery_address: "chennai",
    customer_phone_code: "+91",
    customer_phone_number: "8787563211",
    customer_image: "https://wwww/images.jpeg",
    order_instruction: "Some instruction",
    order_id: "01aab017-f419-400b-9a11-6d7a4ad43ecd",
    customer: {
      id: "cacb121e-28be-11ec-9621-0242ac130002",
      name: "Andrey",
      latitude: "13.08268020",
      longitude: "20.08268020",
    },
    table: {
      id: "01ccb017-f419-400b-9a11-6d7a4ad43ecd",
      name: "Table 1",
    },
    date: "2023-02-17",
    time: "16:02:19",
    items_count: 2,
    item_details: [
      {
        id: "01ddb017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 1",
      },
      {
        id: "01ee017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 2",
      },
    ],
    amount: 100.5,
    payment_status: "paid",
    order_status: "ordered",
    brand_details: {
      id: "e3caeeb0-b57b-4306-9bcd-80104d9d26e1",
      name: "Hotel King A",
      location: "Chennai",
      latitude: "13.08268020",
      longitude: "80.27071840",
      email: "hotelkinga@gmail.com",
      currency: "VEF",
    },
    delivery_fee: 100,
    cancelled_reason: "some reason if added",
    delivery_status: "delivered",
    customer_rating: 4.5,
  },
  {
    order_number: 1132,
    customer_delivery_address: "chennai",
    customer_phone_code: "+91",
    customer_phone_number: "8787563211",
    customer_image: "https://wwww/images.jpeg",
    order_instruction: "Some instruction",
    order_id: "01aab017-f419-400b-9a11-6d7a4ad43ecd",
    customer: {
      id: "cacb121e-28be-11ec-9621-0242ac130002",
      name: "Yuma",
      latitude: "13.08268020",
      longitude: "20.08268020",
    },
    table: {
      id: "01ccb017-f419-400b-9a11-6d7a4ad43ecd",
      name: "Table 1",
    },
    date: "2023-02-17",
    time: "16:02:19",
    items_count: 2,
    item_details: [
      {
        id: "01ddb017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 1",
      },
      {
        id: "01ee017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 2",
      },
    ],
    amount: 100.5,
    payment_status: "paid",
    order_status: "accepted",
    brand_details: {
      id: "e3caeeb0-b57b-4306-9bcd-80104d9d26e1",
      name: "Hotel King A",
      location: "Chennai",
      latitude: "13.08268020",
      longitude: "80.27071840",
      email: "hotelkinga@gmail.com",
      currency: "VEF",
    },
    delivery_fee: 100,
    cancelled_reason: "some reason if added",
    delivery_status: "delivered",
    customer_rating: 4.5,
  },
  {
    order_number: 1002,
    customer_delivery_address: "chennai",
    customer_phone_code: "+91",
    customer_phone_number: "8787563211",
    customer_image: "https://wwww/images.jpeg",
    order_instruction: "Some instruction",
    order_id: "01aab017-f419-400b-9a11-6d7a4ad43ecd",
    customer: {
      id: "cacb121e-28be-11ec-9621-0242ac130002",
      name: "Shuraj",
      latitude: "13.08268020",
      longitude: "20.08268020",
    },
    table: {
      id: "01ccb017-f419-400b-9a11-6d7a4ad43ecd",
      name: "Table 1",
    },
    date: "2023-02-17",
    time: "16:02:19",
    items_count: 2,
    item_details: [
      {
        id: "01ddb017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 1",
      },
      {
        id: "01ee017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 2",
      },
    ],
    amount: 100.5,
    payment_status: "",
    order_status: "canceled",
    brand_details: {
      id: "e3caeeb0-b57b-4306-9bcd-80104d9d26e1",
      name: "Hotel King A",
      location: "Chennai",
      latitude: "13.08268020",
      longitude: "80.27071840",
      email: "hotelkinga@gmail.com",
      currency: "VEF",
    },
    delivery_fee: 100,
    cancelled_reason: "some reason if added",
    delivery_status: "delivered",
    customer_rating: 4.5,
  },
  {
    order_number: 1003,
    customer_delivery_address: "chennai",
    customer_phone_code: "+91",
    customer_phone_number: "8787563211",
    customer_image: "https://wwww/images.jpeg",
    order_instruction: "Some instruction",
    order_id: "01aab017-f419-400b-9a11-6d7a4ad43ecd",
    customer: {
      id: "cacb121e-28be-11ec-9621-0242ac130002",
      name: "Shuraj",
      latitude: "13.08268020",
      longitude: "20.08268020",
    },
    table: {
      id: "01ccb017-f419-400b-9a11-6d7a4ad43ecd",
      name: "Table 1",
    },
    date: "2023-02-17",
    time: "16:02:19",
    items_count: 2,
    item_details: [
      {
        id: "01ddb017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 1",
      },
      {
        id: "01ee017-f419-400b-9a11-6d7a4ad43ecd",
        name: "Item 2",
      },
    ],
    amount: 100.5,
    payment_status: "",
    order_status: "served",
    brand_details: {
      id: "e3caeeb0-b57b-4306-9bcd-80104d9d26e1",
      name: "Hotel King A",
      location: "Chennai",
      latitude: "13.08268020",
      longitude: "80.27071840",
      email: "hotelkinga@gmail.com",
      currency: "VEF",
    },
    delivery_fee: 100,
    cancelled_reason: "some reason if added",
    delivery_status: "delivered",
    customer_rating: 4.5,
  },
]
