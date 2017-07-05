import React from 'react'

export default ({ clauses, esDesafio }) => (
  <div
    className='clauses'
    ref={esDesafio ? contentMount : null}
    dangerouslySetInnerHTML={createClauses(clauses)} />
)

function contentMount (e) {
  if (!e) return
  let a = e.getElementsByTagName('a')[0]
  if (a) a.addEventListener('click', openPopUpWindow)
}

function openPopUpWindow (e) {
  e.preventDefault()
  PopupCenter(e.target.href, 'Desafío Rosario Participa', 900, 500)
}

function PopupCenter (url, title, w, h) {
  var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left
  var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height

  var left = ((width / 2) - (w / 2)) + dualScreenLeft
  var top = ((height / 2) - (h / 2)) + dualScreenTop
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left)

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

function createClauses (clauses) {
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
