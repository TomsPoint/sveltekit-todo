import { supabase } from '$lib/basics/db'

export * from '$lib/api/person'
export * from '$lib/api/students'
export * from '$lib/api/teachers'

export const contacts = {
  async get() {
    const { data } = await supabase
      .from('person')
      .select('*,phone(*),email(*),address(*)')
      .order('first_name', { ascending: true })
    return data
  },
  async getById(id) {
    const { data } = await supabase
      .from('person')
      .select(
        '*,phone(*),email(*),address(*),teacher(*,classroom(*,time_slot(*))),student(*)',
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
