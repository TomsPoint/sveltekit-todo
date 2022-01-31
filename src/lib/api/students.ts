import { supabase } from '$lib/basics/db'

export * from '$lib/api/person'

export const students = {
  async get() {
    const { data } = await supabase
      .from('person')
      .select(
        '*,phone(*),email(*),teacher(*),student(*,student_weekly_enrolment(*,program(*)))',
      )
      .gt('student_id', 0)
      .order('first_name', { ascending: true })
    return data
  },
  async getById(id) {
    const { data } = await supabase
      .from('person')
      .select(
        '*,phone(*),email(*),student(*,student_weekly_enrolment(*),student_classroom_enrolment(*,classroom(*,time_slot(*),teacher(person(first_name)))),student_camp_enrolment(*,camp(*)))',
      )
      .eq('id', id)
      .single()

    return data
  },
  async post(payload) {
    const { data } = await supabase.from('student').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('student').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('student').delete().match({ id: id })
    return data
  },
}
