import { supabase } from '$lib/basics/db'

export const todos = {
  async get() {
    const { data } = await supabase.from('todo').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('todo').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('todo').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('todo').delete().match({ id: id })
    return data
  },
}
