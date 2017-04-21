/**
 * Header wrapper, enables compatibility with old page.js router
 */

import React from 'react'
import { render } from 'react-dom'
import { Router, browserHistory } from 'react-router'
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

render((
  <Router
    history={browserHistory}
    routes={{
      path: '*',
      component: reloadOnSecondRender
    }} />
), wrapper)
