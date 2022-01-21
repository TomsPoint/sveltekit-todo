import * as cookie from 'cookie'

export function expressifyReq(req) {
  return {
    ...req,
    cookies: cookie.parse(req.request.headers.cookie || ''),
  }
}

export function expressifyResp(resp) {
  return {
    ...resp,
    getHeader: (header) => resp.headers[header.toLowerCase()],
    setHeader: (header, value) => (resp.headers[header.toLowerCase()] = value),
    status: (_) => ({ json: (_) => {} }),
  }
}

export function deExpressifyResp(resp) {
  console.log('🚀  ~ file: expressify.ts ~ line 20 ~ resp', resp)

  const { getHeader, setHeader, ...returnAbleResp } = resp
  return returnAbleResp
}
