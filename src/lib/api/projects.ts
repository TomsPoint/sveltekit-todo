import { supabase } from '$lib/basics/db'

export const projects = {
  async get() {
    const { data } = await supabase.from('project').select('*')
    return data
  },
  async getById(id) {
    const { data } = await supabase
      .from('project')
      .select('*')
      .eq('id', id)
      .single()

    return data
  },
  async post(payload) {
    const { data } = await supabase.from('project').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('project').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('project').delete().match({ id: id })
    return data
  },
}
