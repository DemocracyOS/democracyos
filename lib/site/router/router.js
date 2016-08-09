import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import Layout from '../layout/component'
import Topic from '../topic/component'

render((
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <Route path=':forumName' component={Topic} />
    </Route>
  </Router>
), document.getElementById('root'))
