export * from './expressify'
export * from './session'

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
