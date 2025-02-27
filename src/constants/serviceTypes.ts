export enum ServiceType {
  DINE_IN = "dine_in",
  DELIVERY = "delivery",
  PICKUP = "pickup",
}

export const SERVICE_TYPE_CONFIG = {
  [ServiceType.DINE_IN]: {
    allowKey: "allow_dine_in",
    label: "Dine In",
  },
  [ServiceType.DELIVERY]: {
    allowKey: "allow_delivery",
    label: "Delivery",
  },
  [ServiceType.PICKUP]: {
    allowKey: "allow_pickup",
    label: "Pickup",
  },
} as const
