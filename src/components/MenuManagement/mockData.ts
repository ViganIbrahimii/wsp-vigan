import { ServiceType } from "@/constants/serviceTypes"

import { FilteredServiceType } from "@/types/interfaces/filteredServiceType.interface"
import { ItemList } from "@/types/interfaces/item.interface"

export const mockServiceTypes: FilteredServiceType[] = [
  {
    id: "all",
    label: "All Services",
    value: "all",
    count: 150,
    allowKey: "true",
  },
  {
    id: "dine-in",
    label: "Dine-in",
    value: ServiceType.DINE_IN,
    count: 120,
    allowKey: "true",
  },
  {
    id: "delivery",
    label: "Delivery",
    value: ServiceType.DELIVERY,
    count: 100,
    allowKey: "true",
  },
  {
    id: "pickup",
    label: "Pickup",
    value: ServiceType.PICKUP,
    count: 80,
    allowKey: "true",
  },
]

export const mockMenus = [
  {
    id: "1",
    name: "Main Menu",
    status: "active",
  },
  {
    id: "2",
    name: "Breakfast Menu",
    status: "active",
  },
  {
    id: "3",
    name: "Desserts",
    status: "active",
  },
  {
    id: "4",
    name: "Beverages",
    status: "active",
  },
]

export const mockCategories = [
  {
    category_id: "1",
    category_name: "Appetizers",
    status: "active",
    active_items_count: 12,
    inactive_items_count: 2,
  },
  {
    category_id: "2",
    category_name: "Main Course",
    status: "active",
    active_items_count: 25,
    inactive_items_count: 5,
  },
  {
    category_id: "3",
    category_name: "Desserts",
    status: "active",
    active_items_count: 8,
    inactive_items_count: 1,
  },
  {
    category_id: "4",
    category_name: "Beverages",
    status: "active",
    active_items_count: 15,
    inactive_items_count: 3,
  },
]

const defaultItemDetails = {
  item_details: "",
  brand_id: "mock-brand-id",
  service_type: {
    id: "1",
    name: "Food",
  },
  supplier: "",
  created_at: "",
  updated_at: "",
  deleted_at: null,
  created_by: "",
  updated_by: "",
  deleted_by: null,
  discount: 0,
  discount_type: "percentage",
  currency: "USD",
  quantity_of_item: 0,
  attachment: [],
}

export const mockItems: ItemList[] = [
  {
    ...defaultItemDetails,
    item_id: "1",
    item_name: "Spring Rolls",
    base_price: 8.99,
    status: "active",
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    categorie_id: "1",
  },
  {
    ...defaultItemDetails,
    item_id: "2",
    item_name: "Chicken Wings",
    base_price: 12.99,
    status: "active",
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    categorie_id: "1",
  },
  {
    ...defaultItemDetails,
    item_id: "3",
    item_name: "Beef Stir Fry",
    base_price: 24.99,
    status: "active",
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    categorie_id: "2",
  },
  {
    ...defaultItemDetails,
    item_id: "4",
    item_name: "Chocolate Cake",
    base_price: 6.99,
    status: "active",
    is_dine_in_enabled: true,
    is_delivery_enabled: true,
    is_pickup_enabled: true,
    categorie_id: "3",
  },
]
