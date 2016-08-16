import 'native-promise-only'
import './timeago-fix'
import timeago from 'democracyos-timeago'
import config from '../../config/config'

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
 * Mount applications.
 */

// import '../../analytics'
// import '../../body-classes/body'
// import '../../error-pages/error-pages'
// import '../../site/header/header'
// import '../../site/sidebar/sidebar'
// import '../../site/help/help'
// import '../../site/signin/signin'
// import '../../site/signup/signup'
// import '../../site/forgot/forgot'
// import '../../site/notifications-page/notifications'
// import '../../site/auth-facebook/auth-facebook'
// import '../../site/logout/logout'
// import '../../site/topic/topic-react'
// import '../../site/newsfeed/newsfeed'
// import '../../site/homepage/homepage'
// import '../../404/404'

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Layout from 'lib/site/layout/component'

import getForum from 'lib/site/fetch-stores/get-forum'
import TopicLayout from 'lib/site/topic-layout/component'
import ForumHome from 'lib/site/forum-home/component'

/**
 * Init `timeago` component with parameter locale
 */

timeago('.ago', { lang: config.locale, interval: 1000 })



      // <IndexRoute component={SiteHome}/>
      // <Route path='/signin' component={SignIn} />
      // <Route path='/signup' component={SignUp} />
      // <Route path='/forgot' component={forgot} />
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
      <Route path='/:forumName' onEnter={getForum}>
        <IndexRoute component={ForumHome} />
        <Route path='/:forumName/topic/:topicId' component={TopicLayout} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'))
