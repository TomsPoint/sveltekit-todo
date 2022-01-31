import { supabase } from '$lib/basics/db'

export * from '$lib/api/classrooms'
export * from '$lib/api/students'

export const enrolment = {
  async get() {
    const { data } = await supabase
      .from('student_classroom_enrolment')
      .select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase
      .from('student_classroom_enrolment')
      .insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase
      .from('student_classroom_enrolment')
      .upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase
      .from('student_classroom_enrolment')
      .delete()
      .match({ id: id })
    return data
  },
}
