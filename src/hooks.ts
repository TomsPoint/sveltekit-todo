// @ts-nocheck
import { auth } from '$lib/db'
import {
  expressifyReq,
  expressifyResp,
  deExpressifyResp,
} from '$lib/utils/expressify'

export async function handle({ event, resolve }) {
  event.locals.user =
    (await (await auth.api.getUserByCookie(expressifyReq(event))).user) || {}

  let response = await resolve(event, {
    ssr: !event.url.pathname.includes('/edit'),
  })

  if (
    event.request.method === 'POST' &&
    event.url.pathname === '/api/auth.json'
  ) {
    console.log(response)
    console.log(response.headers)
    auth.api.setAuthCookie(event, expressifyResp(response))
    response = deExpressifyResp(response)
  }

  return {
    ...response,
    headers: {
      ...response.headers,
    },
  }
}

export async function getSession(event) {
  const { user } = event.locals
  return {
    user,
  }
}
