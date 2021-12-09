import type { Request } from '@sveltejs/kit'
import { auth } from '$lib/db'
import {
  expressifyReq,
  expressifyResp,
  deExpressifyResp,
} from '$lib/utils/expressify'

export async function handle({
  request,
  resolve,
}: {
  request: Request
  resolve: (request: Request) => Response | Promise<Response>
}) {
  request.locals.user =
    (await (await auth.api.getUserByCookie(expressifyReq(request))).user) || {}

  let response = await resolve(request)

  // Set/Reset authentication cookies for Supabase, when user signs in or signs out
  if (request.method === 'POST' && request.path === '/api/auth.json') {
    auth.api.setAuthCookie(request, expressifyResp(response))
    response = deExpressifyResp(response)
  }

  return response
}

export async function getSession(request: Request) {
  const { user } = request.locals
  return {
    user,
  }
}
