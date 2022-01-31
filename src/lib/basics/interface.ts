export interface Program {
  id?: number
  label: string
  level: []
  name: string
  slot_duration: number
}

export interface Person {
  id?: number
  birthday: Date
  student_id?: number
  teacher_id?: number
  billing_contact_id?: number
  contact_person_id?: number
  lead_id: number
  address: Address[]
  email: Email[]
  phone: Phone[]
}
export interface Address {
  id?: number
  person_id: number
  primary: boolean
  billing: boolean
  street: string
  zip: string
  city: string
  country: string
}
export interface Email {
  id?: number
  person_id: number
  primary: boolean
  email: string
}
export interface Phone {
  id?: number
  person_id: number
  primary: boolean
  whatsapp: boolean
  phone: string
}

export interface Student {
  id: number
  short_name: string
  certificate_name: string
  weekly_status: string
  git_username: String[]
  portfolio: String[]
  school: string
  scratch_username: String[]
  student_weekly_enrolment: StudentWeeklyEnrolment[]
  student_classroom_enrolment: StudentClassroomEnrolment[]
  student_camp_enrolment: StudentCampEnrolment[]
}

export interface StudentWeeklyEnrolment {
  id: number
  program_id: number
  frequency: number
  start_date: Date
  end_date: Date
}

export interface StudentClassroomEnrolment {
  id?: number
  student_id: number
  classroom_id: number
  start_date: Date
  end_date: Date
  classroom?: Classroom
}
export interface Classroom {
  id?: number
  mode: string
  program_id: number
  time_slot_id: number
  teacher_id: number
  capacity: number
  start_date: Date
  end_date: Date
  time_slot?: TimeSlot
  teacher?: Teacher
}

export interface StudentCampEnrolment {
  id: number
  student_id: number
  classroom_id: number
  time_slot_id: number
  start_date: Date
  end_date: Date
  camp?: Camp
}
export interface Camp {
  mode: string
  program_id: number
  time_slot: TimeSlot
  teacher: Teacher
  start_date: Date
  end_date: Date
}

export interface TimeSlot {
  id?: number
  weekday: string
  time: string
  program: String[]
  label: string
  duration: number
}

export interface Teacher {
  id?: number
  programs: []
  person: [Person]
}

export interface Person {
  first_name: string
  last_name: string
}

export interface Tabs {
  tabs: String[]
  name: String
}

export interface Absence {
  id?: number
  student_id: number
  missed_date: Date
  missed_classroom_id: number
  makeup_date?: Date | null
  makeup_classroom_id?: number
  status: 'open' | 'sheduled' | 'missed' | 'consumed'
}
