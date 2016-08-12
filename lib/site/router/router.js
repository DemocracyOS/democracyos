import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import Layout from 'lib/site/layout/component'

import getForum from 'lib/site/fetch-stores/get-forum'
import TopicLayout from 'lib/site/topic-layout/component'
import TopicArticle from 'lib/site/topic-article/component'
import ForumHome from 'lib/site/forum-home/component'

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
        <Route path='/:forumName/topic' component={TopicLayout}>
          <Route path='/:forumName/topic/:topicId' component={TopicArticle} />
        </Route>
      </Route>
    </Route>
  </Router>
), document.getElementById('root'))
