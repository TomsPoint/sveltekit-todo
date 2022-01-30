export const ROUTE_HOME = '/'
export const ROUTE_AUTH = '/auth'
export const PROTECTED_ROUTES = [
  '/todos',
  '/ideas',
  '/time-slot',
  '/calendar',
  '/students',
  '/teachers',
  '/projects',
  '/contacts',
]
export const ROUTES = [
  { route: '/todos', label: 'Todos' },
  { route: '/ideas', label: 'Ideas' },
  { route: '/time-slot', label: 'Time Slots' },
  { route: '/calendar', label: 'Calendar' },
  { route: '/projects', label: 'Projects' },
  { route: '/contacts', label: 'Contacts' },
  { route: '/teachers', label: 'Teachers' },
  { route: '/students', label: 'Students' },
]
export const GENDER = [
  { name: 'Male', value: 'male' },
  { name: 'Female', value: 'female' },
]
export const WEEKLY_STATUS = ['active', 'inactive', 'dormant']
export const MODI = ['offline', 'online']
export const TYPES = ['regular', 'makeup', 'camp', 'trial']
export const DATEFORMAT = 'DD/MM/YYYY'

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
export const WEEKDAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
export const WEEKEND = ['Saturday', 'Sunday']

export const TIMESLOTS = [
  { time: '14:00 - 15:00', duration: 60 },
  { time: '15:30 - 16:30', duration: 60 },
  { time: '17:00 - 18:00', duration: 60 },
  { time: '9:30 - 10:30', duration: 60 },
  { time: '11:00 - 12:00', duration: 60 },
  { time: '13:30 - 14:30', duration: 60 },
  { time: '15:00 - 16:00', duration: 60 },
  { time: '14:30 - 16:00', duration: 90 },
  { time: '16:30 - 18:00', duration: 90 },
  { time: '18:00 - 19:30', duration: 90 },
  { time: '9:00 - 10:30', duration: 90 },
  { time: '11:00 - 12:30', duration: 90 },
  { time: '13:00 - 14:30', duration: 90 },
  { time: '15:00 - 16:30', duration: 90 },
  { time: '17:00 - 18:30', duration: 90 },
]
