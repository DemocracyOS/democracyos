import user from 'lib/site/user/user'

if (user.profileIsComplete) {
  throw new Error('user.profileIsComplete already defined')
}

user.profileIsComplete = function profileIsComplete () {
  if (!user.state.fulfilled) return null

  const attrs = user.state.value

  return !!(
    attrs.extra &&
    attrs.extra.cod_doc &&
    attrs.extra.nro_doc &&
    attrs.extra.sexo
  )
}

user.saveExtraData = function saveExtraData (data) {
  return fetch('/signup/complete', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    if (res.status >= 200 && res.status < 300) return res.json()

    const err = new Error(res.statusText)
    err.res = res
    throw err
  })
}
