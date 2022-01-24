import { supabase } from '$lib/db'

export const projects = {
  async all() {
    const { data } = await supabase.from('project').select('*')
    return data
  },
  // async post(payload) {
  //   const { data } = await supabase.from('API').insert(payload)
  //   return data
  // },
  // async update(payload) {
  //   const { data } = await supabase.from('API').upsert(payload)
  //   return data
  // },
  // async delete(id) {
  //   const { data } = await supabase.from('API').delete().match({ id: id })
  //   return data
  // },
}
