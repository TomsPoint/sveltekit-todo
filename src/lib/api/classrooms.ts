import { supabase } from '$lib/basics/db'

export const classrooms = {
  async get() {
    const { data } = await supabase
      .from('classroom')
      .select(
        '*,student_classroom_enrolment(*),time_slot(*),program(*),teacher(*,person(*))',
      )
    return data
  },
  async getTimeSlot() {
    const { data } = await supabase.from('time_slot').select('*')
    return data
  },
  async post(payload) {
    const { data, error } = await supabase.from('classroom').insert(payload)
    if (error) console.log(error)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('classroom').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('classroom').delete().match({ id: id })
    return data
  },
}
