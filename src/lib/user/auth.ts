import type{ AuthSession } from '@supabase/supabase-js'
import { goto } from '$app/navigation';
import { auth } from '$lib/db'
import { setAuthCookie, unsetAuthCookie } from '$lib/utils/session'
import { ROUTE_HOME, } from '$lib/constants'

export async function signOut() {
    await auth.signOut()
    await unsetAuthCookie()
    goto(ROUTE_HOME)
}

export async function setServerSessionAndRedir(session: AuthSession) {
    await setAuthCookie(session)
    goto(ROUTE_HOME)
}