export interface WorkingHours {
  monday: number
  monday_start_time: string
  monday_end_time: string
  tuesday: number
  tuesday_start_time: string
  tuesday_end_time: string
  wednesday: number
  wednesday_start_time: string
  wednesday_end_time: string
  thursday: number
  thursday_start_time: string
  thursday_end_time: string
  friday: number
  friday_start_time: string
  friday_end_time: string
  saturday: number
  saturday_start_time: string
  saturday_end_time: string
  sunday: number
  sunday_start_time: string
  sunday_end_time: string
}

export interface Staff {
  id: string
  name: string
  email: string
  gender: string
  restaurant_id: string
  restaurant_name: string
  role: string
  role_id: number
  sections: any[]
  workingHours: WorkingHours
}
