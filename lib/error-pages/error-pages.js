import page from 'page'
import render from '../render/render'
import error404 from './error-404.jade'

page(['/401', '/404', '/500'], (ctx, next) => {
  document.body.classList.add('not-found-page')
  const content = document.querySelector('#content')
  content.innerHTML = render(error404)
})
