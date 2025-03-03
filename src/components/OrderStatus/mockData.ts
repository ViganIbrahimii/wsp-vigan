export interface Order {
  id: number
  status: "preparing" | "ready"
  createdAt: string
}

export interface Brand {
  id: number
  name: string
  logo?: string
  initials: string
}

export const mockBrand: Brand = {
  id: 1,
  name: "McDonald's",
  logo: "/mc-donalds.png",
  initials: "MD",
}

export const mockOrders: Order[] = [
  // Preparing Orders
  { id: 1234, status: "preparing", createdAt: "2024-03-03T10:00:00Z" },
  { id: 2345, status: "preparing", createdAt: "2024-03-03T10:01:00Z" },
  { id: 3456, status: "preparing", createdAt: "2024-03-03T10:02:00Z" },
  { id: 4567, status: "preparing", createdAt: "2024-03-03T10:03:00Z" },
  { id: 5678, status: "preparing", createdAt: "2024-03-03T10:04:00Z" },
  { id: 6789, status: "preparing", createdAt: "2024-03-03T10:05:00Z" },
  { id: 7890, status: "preparing", createdAt: "2024-03-03T10:06:00Z" },
  { id: 8901, status: "preparing", createdAt: "2024-03-03T10:07:00Z" },
  { id: 9012, status: "preparing", createdAt: "2024-03-03T10:08:00Z" },
  { id: 123, status: "preparing", createdAt: "2024-03-03T10:09:00Z" },

  // Ready Orders
  { id: 4321, status: "ready", createdAt: "2024-03-03T09:55:00Z" },
  { id: 5432, status: "ready", createdAt: "2024-03-03T09:56:00Z" },
  { id: 6543, status: "ready", createdAt: "2024-03-03T09:57:00Z" },
  { id: 7654, status: "ready", createdAt: "2024-03-03T09:58:00Z" },
  { id: 8765, status: "ready", createdAt: "2024-03-03T09:59:00Z" },
  { id: 9876, status: "ready", createdAt: "2024-03-03T10:00:00Z" },
  { id: 987, status: "ready", createdAt: "2024-03-03T10:01:00Z" },
  { id: 1098, status: "ready", createdAt: "2024-03-03T10:02:00Z" },
  { id: 2109, status: "ready", createdAt: "2024-03-03T10:03:00Z" },
  { id: 3210, status: "ready", createdAt: "2024-03-03T10:04:00Z" },
]
