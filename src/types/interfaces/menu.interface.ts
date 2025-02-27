export interface Menu {
  id: string
  user_id: string
  brand_id: string
  name: string
  status: "active" | "inactive"
  attachment: {
    id: string
    cid: string
    type: string
    name: string
  }
  menu_default: "yes" | "no"
  menu_color_code: string
  target_language_name: string
}
