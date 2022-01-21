import { supabase } from '$lib/db'

// get functions
export async function get(
  table,
  query = '*',
  { sort = 'id', ascending = true } = {},
) {
  const res = await supabase
    .from(table)
    .select(query)
    .order(sort, { ascending })
  if (res.error) {
    if (res.error.message === 'JWT expired') location.reload()
    console.log(`~ API error loading ${table}. Message:`, res.error)
  }
  return res.data
}

export async function getFiltered(
  table,
  query = '*',
  {
    filter = 'eq',
    column = 'id',
    value = 0,
    sort = 'id',
    ascending = true,
    single = false,
  },
) {
  let res
  if (single) {
    res = await supabase
      .from(table)
      .select(query)
      [filter](column, value)
      .order(sort, { ascending })
      .single()
  } else {
    res = await supabase
      .from(table)
      .select(query)
      [filter](column, value)
      .order(sort, { ascending })
  }
  if (res.error)
    console.log(`~ API error loading ${table}. Message:`, res.error)
  return res.data
}

// add functions
export async function post(table, data) {
  const res = await supabase.from(table).insert(data)
  if (res.error) console.log(`~ API error adding ${table}. Message:`, res.error)
  return res.data
}

// update functions
export async function put(table, data) {
  const res = await supabase.from(table).upsert(data)
  if (res.error)
    console.log(`~ API error updating ${table}. Message:`, res.error)
  return res.data
}

// delte functions
export async function del(table, match) {
  const res = await supabase.from(table).delete().match(match)
  if (res.error)
    console.log(`~ API error deleting ${table}. Message:`, res.error)
  return res.data
}

export async function deleteFiltered(
  table,
  { filter = 'in', column = 'id', value = 0 },
) {
  let res = await supabase.from(table).delete()[filter](column, value)
  if (res.error)
    console.log(`~ API error loading ${table}. Message:`, res.error)
  return res.data
}
export async function deleteId(table, id) {
  const res = await supabase.from(table).delete().match({ id: id })
  if (res.error)
    console.log(`~ API error deleting ${table}. Message:`, res.error)
  return res.data
}
