import { supabase } from '$lib/db'

export const API = {
  async get() {
    const { data } = await supabase.from('API').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('API').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('API').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('API').delete().match({ id: id })
    return data
  },
}
