/**
 * Header wrapper, enables compatibility with old page.js router
 */

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
import user from 'lib/site/user/user'
import Header from './component'

const wrapper = document.createElement('div')
wrapper.classList.add('header-wrapper')
document.body.insertBefore(wrapper, document.body.firstChild)

let firstRoute = null
const reloadOnSecondRender = ({ location }) => {
  if (firstRoute && firstRoute !== location.pathname) {
    window.location.reload(false)
  }

  firstRoute = location.pathname

  return <Header />
}

// Force refresh on logout
user.onChange(() => {
  if (user.state.rejected && user.state.reason === 'loggedout') {
    window.location.reload(false)
  }
})

render((
  <Router
    history={browserHistory}
    routes={{
      path: '*',
      component: reloadOnSecondRender
    }} />
), wrapper)
