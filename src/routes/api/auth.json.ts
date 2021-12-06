export async function post(req) {
  return {
    status: 200,
    body: null,
  }
}
export async function get(req) {
  const { user } = await req.locals
  return {
    body: {
      user,
    },
  }
}
