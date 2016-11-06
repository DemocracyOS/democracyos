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
