import FormView from '../form-view/form-view.js'
import template from './reset-form.jade'

export default class ResetPasswordView extends FormView {

  /**
   * ResetPasswordView
   *
   * @return {ResetPasswordView} `ResetPasswordView` instance.
   * @api public
   */

  constructor (token) {
    super(template, { token: token })
    this.token = token
  }

  switchOn () {
    this.on('success', this.bound('onsuccess'))
  }

  switchOff () {
    this.off('success', this.bound('onsuccess'))
  }

  onsuccess (res) {
    // // TODO cancel verify request if not finished
    // request
    // .post('/forgot/reset')
    // .send(data)
    // .end(function(err, res) {
    // if (!res.ok) {
    //    return this.errors([res.error])
    // }
    // if (err || (res.body && res.body.error)) {
    //   return this.errors([err || res.body.error])
    // }
    window.location.replace('/')
  // })
  }
}
