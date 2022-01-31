import { supabase } from '$lib/basics/db'

export const time_slot = {
  async get() {
    const { data } = await supabase
      .from('time_slot')
      .select('*')
      .order('sort_order', { ascending: true })
    return data
  },
  async getForCalendar() {
    const { data } = await supabase
      .from('time_slot')
      .select(
        '*,classroom(*,student_classroom_enrolment(*,student(*,person(*))),time_slot(*),teacher(person(*)))',
      )
      .order('sort_order', { ascending: true })
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('time_slot').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('time_slot').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('time_slot').delete().match({ id: id })
    return data
  },
}
