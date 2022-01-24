// @ts-nocheck

export async function handle({ event, resolve }) {
  let response = await resolve(event, {
    ssr: !event.url.pathname.includes('/edit'),
  })

  return response
}

export async function getSession(event) {
  const { user } = event.locals
  return {
    user,
  }
}
