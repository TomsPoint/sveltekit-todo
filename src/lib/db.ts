import { createClient } from '@supabase/supabase-js'
import { readable } from 'svelte/store'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL.toString(),
  import.meta.env.VITE_SUPABASE_ANON_KEY.toString(),
)

export const auth = supabase.auth

export const user = readable(supabase.auth.user(), (set) => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_OUT') {
      set(null)
    }
  })
})
