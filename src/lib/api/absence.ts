import { supabase } from '$lib/basics/db'

export const absence = {
  async get() {
    const { data } = await supabase.from('absence').select('*')
    return data
  },
  async getClassrooms() {
    const { data } = await supabase
      .from('classroom')
      .select(
        '*,teacher(*,person(*)),time_slot(*),student_classroom_enrolment(*)',
      )
    return data
  },
  async getStudent(id) {
    const { data } = await supabase
      .from('student')
      .select('*,student_weekly_enrolment(*)')
      .eq('id', id)
      .single()
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('absence').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('absence').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('absence').delete().match({ id: id })
    return data
  },
}
