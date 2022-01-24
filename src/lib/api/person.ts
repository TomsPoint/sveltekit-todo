import { supabase } from '$lib/db'

export const person = {
  async get() {
    const { data } = await supabase.from('person').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('person').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('person').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('person').delete().match({ id: id })
    return data
  },
}

export const email = {
  async get() {
    const { data } = await supabase.from('email').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('email').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('email').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('email').delete().match({ id: id })
    return data
  },
}

export const phone = {
  async get() {
    const { data } = await supabase.from('phone').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('phone').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('phone').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('phone').delete().match({ id: id })
    return data
  },
}

export const address = {
  async get() {
    const { data } = await supabase.from('address').select('*')
    return data
  },
  async post(payload) {
    const { data } = await supabase.from('address').insert(payload)
    return data
  },
  async update(payload) {
    const { data } = await supabase.from('address').upsert(payload)
    return data
  },
  async delete(id) {
    const { data } = await supabase.from('address').delete().match({ id: id })
    return data
  },
}
