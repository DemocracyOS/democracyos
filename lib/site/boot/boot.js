import 'native-promise-only'
import timeago from 'democracyos-timeago'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import config from '../../config/config'
import t from 't-component'
import './timeago-fix'

import Layout from 'lib/site/layout/component'

import getForum from 'lib/site/fetch-stores/get-forum'
import TopicLayout from 'lib/site/topic-layout/component'
import ForumHome from 'lib/site/forum-home/component'
import SignIn from 'lib/site/sign-in/component'
import SignUp from 'lib/site/sign-up/component'
import Forgot from 'lib/site/forgot/component'
import Reset from 'lib/site/reset/component'
import HelpLayout from 'lib/site/help/component'
import MarkdownArticle from 'lib/site/help/md-article/component'
import MarkdownGuide from 'lib/site/help/md-guide/component'
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
 * Define Help Articles
 */
 
const helpArticles = [
  config.frequentlyAskedQuestions
    ? {
      label: t('help.faq.title'),
      path: '/help/faq',
    }
    : false,
  config.termsOfService
    ? {
      label: t('help.tos.title'),
      path: '/help/terms-of-service',
    }
    : false,
  config.privacyPolicy
    ? {
      label: t('help.pp.title'),
      path: '/help/privacy-policy',
    }
    : false,
  config.glossary
    ? {
      label: t('help.glossary.title'),
      path: '/help/glossary',
    }
    : false,
  {
    label: t('help.markdown.title'),
    path: '/help/markdown'
  }
].filter(p => p)

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
      <Route path='/forgot'>
        <IndexRoute component={Forgot} />
        <Route path='/forgot/:token' component={Reset} />
      </Route>
      <Route path='/help' component={HelpLayout} articles={helpArticles}>
        <IndexRoute component={MarkdownGuide} />
        <Route path='/help/markdown' component={MarkdownGuide} />
        {
          helpArticles.length > 1 &&
            <Route path='/help/:article' component={MarkdownArticle} />
        }
      </Route>
      <Route path='/:forumName' onEnter={getForum}>
        <IndexRoute component={ForumHome} />
        <Route path='/:forumName/topic/:topicId' component={TopicLayout} />
      </Route>
    </Route>
  </Router>
), document.getElementById('root'))
