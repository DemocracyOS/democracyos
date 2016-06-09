import page from 'page'
import o from 'component-dom'
import title from '../title/title.js'
import t from 't-component'
import config from '../config/config.js'
import user from '../user/user.js'
import SigninForm from './view.js'
import authFacebookForm from '../auth-facebook/form'

page('/signin', externalSignin, user.optional, user.loggedoff, authFacebookForm, () => {
  // Build signin view with options
  var form = new SigninForm()

  // Display section content
  o(document.body).addClass('signin-page')

  // Update page's title
  title(t('signin.login'))

  // Render signin-page into content section
  form.replace('#content')
})

page('/signin/:token', () => {
  // Redirect to home with full page reload
  window.location = '/'
})

function externalSignin (ctx, next) {
  if (!config.signinUrl) return next()
  var url = config.signinUrl + '?returnUrl=' + encodeURI(window.location.href)
  window.location = url
}
