import 'native-promise-only'
import timeago from 'democracyos-timeago'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import config from '../../config/config'
import './timeago-fix'

import Layout from 'lib/site/layout/component'

import TopicLayout from 'lib/site/topic-layout/component'
import ForumHome from 'lib/site/forum-home/component'
import SignIn from 'lib/site/sign-in/component'
import SignUp from 'lib/site/sign-up/component'
import Forgot from 'lib/site/forgot/component'
import Reset from 'lib/site/reset/component'
import Help from 'lib/site/help/component'
// import '../../analytics'
// import '../../body-classes/body'
// import '../../error-pages/error-pages'
// import '../../site/notifications-page/notifications'
// import '../../site/newsfeed/newsfeed'
// import '../../site/homepage/homepage'
// import '../../404/404'

import '../../translations/translations'

/**
 * Enable client-side debug messages
 */

import '../../debug'

/**
 * Load currentUser
 */

import '../../user/user'

/**
 * Init `timeago` component with parameter locale
 */

timeago('.ago', { lang: config.locale, interval: 1000 })

/**
 * Mount applications.
 */

// <IndexRoute component={SiteHome}/>
render((
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/signup/:reference' component={SignUp} />
      <Route path='/forgot' component={Forgot} />
      <Route path='/forgot/:token' component={Reset} />

      <Route path='/help' component={Help} />
      <Route path='/help/:article' component={Help} />

      <Route path='/:forumName' component={ForumHome} />
      <Route path='/:forumName/topic/:topicId' component={TopicLayout} />
    </Route>
  </Router>
), document.getElementById('root'))
