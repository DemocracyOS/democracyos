import 'native-promise-only'
import timeago from 'democracyos-timeago'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import config from '../../config/config'
import './timeago-fix'

import Layout from 'lib/site/layout/component'

import getForum from 'lib/site/fetch-stores/get-forum'
import TopicLayout from 'lib/site/topic-layout/component'
import ForumHome from 'lib/site/forum-home/component'
import SignIn from 'lib/site/sign-in/component'
import SignUp from 'lib/site/sign-up/component'
import Forgot from 'lib/site/forgot/component'
// import '../../analytics'
// import '../../body-classes/body'
// import '../../error-pages/error-pages'
// import '../../site/help/help'
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
// <Route path='/help' component={HelpLayout}>
//   <IndexRoute component={HelpHome}/>
//   <Route path='markdown' component={markdown} />
//   <Route path='terms-of-service' component={termsOfService} />
//   <Route path='privacy-policy' component={privacyPolicy} />
//   <Route path='faq' component={faq} />
//   <Route path='glossary' component={glossary} />
// </Route>
render((
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <Route path='/signin' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      <Route path='/signup/:reference' component={SignUp} />
      <Route path='/forgot' component={Forgot} />
      <Route path='/:forumName' onEnter={getForum}>
        <IndexRoute component={ForumHome} />
        <Route path='/:forumName/topic/:topicId' component={TopicLayout} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'))
