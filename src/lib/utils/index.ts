// @ts-nocheck
export * from './expressify'
export * from './session'
import { goto } from '$app/navigation'

export const back = (url) => {
  goto(url.substring(0, url.lastIndexOf('/') + 1))
}

export function getFormBody(body) {
  if (Array.isArray(body)) {
    return [...body.entries()].reduce((data, [k, v]) => {
      let value = v
      if (value === 'true') value = true
      if (value === 'false') value = false
      if (k in data)
        data[k] = Array.isArray(data[k])
          ? [...data[k], value]
          : [data[k], value]
      else data[k] = value
      return data
    }, {})
  } else {
    return body
  }
}

export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const uid = () =>
  Math.floor(Date.now() + Math.random() * 100).toString(36)

export const getUrlParams = (query) =>
  Array.from(new URLSearchParams(query)).reduce(
    (p, [k, v]) =>
      Object.assign({}, p, {
        [k]: p[k] ? (Array.isArray(p[k]) ? p[k] : [p[k]]).concat(v) : v,
      }),
    {},
  )

export const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ''

export const toSlug = (s) =>
  s
    .toString()
    .normalize('NFC')
    .toLowerCase()
    .replace(/\s+/g, '-') //spaces to dashes
    .replace(/&/g, '-and-') //ampersand to and
    .replace(/[^\w-]+/g, ' ') //remove non-words
    .replace(/--+/g, '-') //collapse multiple dashes
    .replace(/^-+/, '') //trim starting dash
    .replace(/-+$/, '') //trim ending dash
