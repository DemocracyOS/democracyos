let responseCache = null
let currentFetch = null

export function fetchStatusDo () {
  if (currentFetch) return currentFetch

  currentFetch = fetch('/ext/api/participatory-budget/status', {
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    if (res.status >= 200 && res.status < 300) return res.json()

    const err = new Error(res.statusText)
    err.res = res
    throw err
  }).then((body) => {
    responseCache = body
    currentFetch = null
    return responseCache
  }).catch((err) => {
    responseCache = null
    currentFetch = null
    console.error(err)
    throw err
  })

  return currentFetch
}

export default function fetchStatus () {
  if (responseCache) {
    return Promise.resolve(responseCache)
  } else {
    return fetchStatusDo()
  }
}
