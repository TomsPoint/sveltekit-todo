import { supabase } from '$lib/db'

export const enrolment = {
  async get() {
    const { data } = await supabase.from('student_weekly_enrolment').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase
      .from('student_weekly_enrolment')
      .insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase
      .from('student_weekly_enrolment')
      .upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase
      .from('student_weekly_enrolment')
      .delete()
      .match({ id: id })
    return data
  },
}
