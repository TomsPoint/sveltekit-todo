import { supabase } from './db'

export async function get(table, query = '*') {
  const res = await supabase.from(table).select(query)
  if (res.error) console.log(`~ error loading ${table}. Message:`, res.error)
  return res.data
}

export async function post(table, data) {
  const res = await supabase.from(table).insert(data)
  if (res.error) console.log(`~ error adding ${table}. Message:`, res.error)
  return res.data
}

export async function put(table, data) {
  const res = await supabase.from(table).upsert(data)
  if (res.error) console.log(`~ error updating ${table}. Message:`, res.error)
  return res.data
}

export async function del(table, id) {
  const res = await supabase.from(table).delete().match({ id: id })
  if (res.error) console.log(`~ error deleting ${table}. Message:`, res.error)
  return res.data
}
