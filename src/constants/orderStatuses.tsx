import { MainButtonProps } from "@/components/mainButton"

export enum OrderStatuses {
  ORDERED = "ordered",
  ACCEPTED = "accepted",
  READY = "ready",
  SERVED = "served",
  CANCELED = "canceled",
  CLOSED = "closed",
  REJECTED = "rejected",
  ADVANCED = "advanced",
  DO_NOT_ACCEPT = "do_not_accept",
  DELIVERED = "delivered",
}

export const statusStyles: {
  [key in OrderStatuses]?: {
    textColor: string
    bulletColor: string
    buttonVariant: MainButtonProps["variant"]
    borderColor: string
    backgroundColor: string
  }
} & {
  default: {
    textColor: string
    bulletColor: string
    buttonVariant: MainButtonProps["variant"]
    borderColor: string
    backgroundColor: string
  }
} = {
  [OrderStatuses.ORDERED]: {
    textColor: "text-status-ordered",
    bulletColor: "bg-status-ordered",
    buttonVariant: "accept",
    borderColor: "border-status-ordered",
    backgroundColor: "bg-status-ordered",
  },
  [OrderStatuses.ACCEPTED]: {
    textColor: "text-status-accepted",
    bulletColor: "bg-status-accepted",
    buttonVariant: "accept",
    borderColor: "border-status-accepted",
    backgroundColor: "bg-status-accepted",
  },
  [OrderStatuses.READY]: {
    textColor: "text-status-ready",
    bulletColor: "bg-status-ready",
    buttonVariant: "ready",
    borderColor: "border-status-ready",
    backgroundColor: "bg-status-ready",
  },
  [OrderStatuses.SERVED]: {
    textColor: "text-status-served",
    bulletColor: "bg-status-served",
    buttonVariant: "served",
    borderColor: "border-status-served",
    backgroundColor: "bg-status-served",
  },
  [OrderStatuses.CANCELED]: {
    textColor: "text-status-canceled",
    bulletColor: "bg-status-canceled",
    buttonVariant: "canceled",
    borderColor: "border-status-canceled",
    backgroundColor: "bg-status-canceled",
  },
  [OrderStatuses.CLOSED]: {
    textColor: "text-black-60",
    bulletColor: "bg-black-60",
    buttonVariant: "canceled",
    borderColor: "border-none",
    backgroundColor: "bg-status-canceled",
  },
  default: {
    textColor: "text-status-default",
    bulletColor: "bg-status-default",
    buttonVariant: "primary",
    borderColor: "border-status-default",
    backgroundColor: "bg-status-default",
  },
}

export const statusMapping: { [key: string]: string } = {
  ordered: "Ordered",
  accepted: "Accepted",
  advanced: "Advanced",
  ready: "Ready",
  closed: "Closed",
  rejected: "Rejected",
  canceled: "Canceled",
  do_not_accept: "Canceled",
  served: "Served",
}
