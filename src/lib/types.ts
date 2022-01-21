export interface PromiseResult {
  status: number
  body: any
}

export type CapacityType = {
  id?: number
  slot_id: number
  modus: 'offline' | 'online'
  curriculum_id: number
  total_capacity: number
  teacher_id?: number
  start?: Date
  end?: Date
  sort_order?: number | null
}
export type EnrolmentType = {
  id: number
  student_id: number
  slot_id: number
  curriculum_id: number
  teacher_id: number
  type: 'regular' | 'makeup' | 'camp' | 'trial'
  modus: 'offline' | 'online'
  start: Date
  end: Date
}

export type CurriculaType = {
  id?: number
  name: string
  label: string
  sort_order?: number
}

export type StudentType = {
  id?: number
  name: string
  school: string
  birthday: Date
  sort_order?: number
}
