import { supabase } from '$lib/basics/db'

export * from '$lib/api/person'

export const teachers = {
  async get() {
    const { data } = await supabase
      .from('person')
      .select('*,phone(*),email(*),teacher(*)')
      .gt('teacher_id', 0)
      .order('first_name', { ascending: true })
    return data
  },
  async getById(id) {
    const { data } = await supabase
      .from('person')
      .select(
        '*,phone(*),email(*),address(*),teacher(*,classroom(*,time_slot(*)))',
      )
      .eq('id', id)
      .single()
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('teacher').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('teacher').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('teacher').delete().match({ id: id })
    return data
  },
}
