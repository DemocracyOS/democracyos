import config from 'lib/config'
import urlBuilder from 'lib/url-builder'
import user from 'lib/site/user/user'

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
import NotFound from 'lib/site/error-pages/not-found/component'
import NotAllowed from 'lib/site/error-pages/not-allowed/component'

/*
  Base routes for the app

  These does not use JSX to allow to change them, before rendering, e.g. from the /ext folder.

  More info: https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/guides/RouteConfiguration.md
*/

export default {
  path: '/',
  component: Layout,
  indexRoute: { component: config.multiForum ? HomeMultiForum : HomeForum },
  childRoutes: [
    { path: '404', component: NotFound },
    { path: '401', component: NotAllowed },
    {
      path: 'signin',
      component: SignIn,
      onEnter: restrictLoggedin
    },
    {
      path: 'signup',
      onEnter: restrictLoggedin,
      indexRoute: { component: SignUp },
      childRoutes: [
        { path: 'resend-validation-email', component: Resend },
        { path: 'validate/:token', component: Resend },
        { path: ':reference', component: SignUp }
      ]
    },
    {
      path: 'forgot',
      onEnter: restrictLoggedin,
      indexRoute: { component: Forgot },
      childRoutes: [
        { path: 'reset/:token', component: Reset }
      ]
    },
    { path: urlBuilder.for('site.help'), component: Help },
    { path: urlBuilder.for('site.help.article'), component: Help },
    { path: urlBuilder.for('site.notifications'), component: Notifications },
    { path: urlBuilder.for('settings'), component: reload },
    { path: urlBuilder.for('settings') + '/*', component: reload },
    { path: urlBuilder.for('site.topic'), component: TopicLayout },
    { path: urlBuilder.for('forums.new'), component: reload },
    { path: urlBuilder.for('admin'), component: reload },
    { path: urlBuilder.for('admin.wild'), component: reload },
    config.multiForum ? {
      path: urlBuilder.for('site.forum'),
      component: HomeForum,
      onEnter: setForumParam
    } : {},
    { path: '*', component: NotFound }
  ]
}

function reload () {
  window.location.reload(false)
  return null
}

function setForumParam (nextState) {
  if (!config.multiForum) {
    nextState.params.forum = config.defaultForum
  }
}

function restrictLoggedin (nextState, replace, next) {
  user.fetch().then(() => {
    if (user.state.rejected) return next()
    window.location = '/'
  }).catch((err) => { throw err })
}
