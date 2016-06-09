import page from 'page'
import qs from 'qs'
import title from '../title/title.js'
import t from 't-component'
import o from 'component-dom'
import user from '../user/user.js'
import config from '../config/config.js'
import SignupForm from './signup-form-view.js'
import EmailValidationForm from './email-validation-form-view.js'
import EmailValidationCompleteForm from './email-validation-complete-view.js'
import ResendValidationEmailForm from './resend-validation-email-form-view.js'
import authFacebookForm from '../auth-facebook/form'

let parse = (ctx, next) => {
  ctx.query = qs.parse(ctx.querystring)
  next()
}

// FIXME: This feature is going to dissapear
let externalSignup = (ctx, next) => {
  if (!config.signupUrl) return next()
  window.location = config.signupUrl
}

page('/signup', externalSignup, user.optional, user.loggedoff, authFacebookForm, parse, (ctx, next) => {
  // Build form view with options
  let reference = ctx.query.reference
  let form = new SignupForm(reference)

  // Display content section
  o(document.body).addClass('signup-page')

  // Update page's title
  title(t('signin.signup'))

  // Empty container and render form
  form.replace('#content')
})

page('/signup/validate/:token', externalSignup, parse, (ctx, next) => {
  // Build form view with options
  let form = new EmailValidationForm(ctx.params.token, ctx.query.reference)

  // Display content section
  o(document.body).addClass('validate-token')

  form.replace('#content')
})

page('/signup/validated', externalSignup, user.required, parse, (ctx, next) => {
  // Build form view with options
  let form = new EmailValidationCompleteForm(ctx.query.reference)

  // Display content section
  o(document.body).addClass('validation-complete')

  form.replace('#content')

  if (ctx.query.reference) {
    setTimeout(() => page(ctx.query.reference), 5000)
  }
})

page('/signup/resend-validation-email', externalSignup, (ctx, next) => {
  // Build form view with options
  let form = new ResendValidationEmailForm()

  // Display content section
  o(document.body).addClass('signup-page')

  // Update page's title
  title(t('signup.resend-validation-email'))

  // Empty container and render form
  form.replace('#content')
})
