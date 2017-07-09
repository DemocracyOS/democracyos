import React from 'react'
import PopupCenter from 'ext/lib/open-popup'

export default ({ clauses, esDesafio, user, titulo, id }) => (
  <div
    className='clauses'
    ref={esDesafio ? contentMount(user, titulo, id) : null}
    dangerouslySetInnerHTML={createClauses(clauses, esDesafio)} />
)

function contentMount (userState, titulo, id) {
  const user = userState.value
  return (e) => {
    if (!e) return
    let a = e.getElementsByTagName('a')
    a = a[a.length - 1]
    if (a) a.addEventListener('click', openPopUpWindow(user, titulo, id))
  }
}

function openPopUpWindow (user, titulo, id) {
  return (e) => {
    e.preventDefault()
    let url = e.target.href
    if (user) {
      url += `?desafio_nombre=${encodeURI(titulo)}&desafio_id=${id}&nombre=${user.firstName}&apellido=${user.lastName}&email=${user.email}&email_conf=${user.email}`
    }
    PopupCenter(url, titulo, 900, 500)
  }
}

function createClauses (clauses, esDesafio) {
  return {
    __html: clauses
      .sort(function (a, b) {
        return a.position > b.position ? 1 : -1
      })
      .map(function (clause) {
        if (clause.markup && ~clause.markup.indexOf('iframe')) {
          return clause.markup.replace('<div><iframe', '<div class="has-video"><iframe')
        }
        return clause.markup
      })
      .join('')
  }
}
