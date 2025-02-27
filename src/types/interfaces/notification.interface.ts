export interface Notification {
  id: string
  restaurant_id?: string
  restaurant_name?: string
  order_id?: string
  order_name?: string
  type?: string
  notification_title: string
  notification_body: string
  notification_message?: string
  acknowledged: string
  date?: string
  time?: string
}

export interface NotificationDetail {
  id: string
  notification_description: string
  notification_date: string
  notification_time: string
}
