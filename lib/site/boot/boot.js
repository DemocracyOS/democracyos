import 'native-promise-only'
import timeago from 'democracyos-timeago'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import config from 'lib/config/config'

import Layout from 'lib/site/layout/component'

import TopicLayout from 'lib/site/topic-layout/component'
import HomeForum from 'lib/site/home-forum/component'
import HomeMultiForum from 'lib/site/home-multiforum/component'
import SignIn from 'lib/site/sign-in/component'
import SignUp from 'lib/site/sign-up/component'
import Resend from 'lib/site/resend/component'
import Forgot from 'lib/site/forgot/component'
import Reset from 'lib/site/reset/component'
import Help from 'lib/site/help/component'
import Notifications from 'lib/site/notifications/component'
import NotFound from 'lib/site/not-found/component'

import 'lib/analytics/analytics'
import 'lib/translations/translations'

/**
 * Enable client-side debug messages
 */

import 'lib/debug'

/**
 * Load currentUser
 */

import 'lib/user/user'

/**
 * Init `timeago` component with parameter locale
 */

import './timeago-fix'

timeago('.ago', { lang: config.locale, interval: 1000 })

/**
 * Mount applications.
 */

render((
  <Router
    history={browserHistory}
    onUpdate={() => { window.analytics.page(window.location.pathname) }}>
    <Route path='/' component={Layout}>
      <Route path='/404' component={NotFound} />

      <Route path='/signin' component={SignIn} />
      <Route path='/signup'>
        <IndexRoute component={SignUp} />
        <Route path='/signup/:reference' component={SignUp} />
        <Route path='/signup/resend-validation-email' component={Resend} />
        <Route path='/signup/validate/:token' component={Resend} />
      </Route>
      <Route path='/forgot' component={Forgot} />
      <Route path='/forgot/:token' component={Reset} />

      <Route path='/help' component={Help} />
      <Route path='/help/:article' component={Help} />

      <Route path='/notifications' component={Notifications} />

      {
        config.multiForum &&
          <IndexRoute component={HomeMultiForum} />
      }
      {
        config.multiForum &&
        (
          <Route path='/:forumName'>
            <IndexRoute component={HomeForum} />
            <Route path='/:forumName/topic/:topicId' component={TopicLayout} />
          </Route>
        )
      }

      {
        !config.multiForum &&
          <IndexRoute component={HomeForum} />
      }
      {
        !config.multiForum &&
        (
          <Route path='/topic/:topicId' component={TopicLayout} />
        )
      }
    </Route>
  </Router>
), document.getElementById('root'))
