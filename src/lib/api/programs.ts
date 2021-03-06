import { supabase } from '$lib/basics/db'

export const programs = {
  async get() {
    const { data } = await supabase
      .from('program')
      .select('*')
      .order('sort_order', { ascending: true })
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('program').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('program').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('program').delete().match({ id: id })
    return data
  },
}
