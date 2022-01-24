import { supabase } from '$lib/db'

export const ideas = {
  async get() {
    const { data } = await supabase.from('idea').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('idea').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('idea').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('idea').delete().match({ id: id })
    return data
  },
}
