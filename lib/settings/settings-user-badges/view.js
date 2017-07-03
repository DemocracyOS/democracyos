/* global fetch */
import t from 't-component'
import 'whatwg-fetch'
import AddUserInput from 'lib/admin/admin-permissions/add-user-input/add-user-input'
import FormView from '../../form-view/form-view'
import template from './template.jade'

export default class UserBadgeView extends FormView {
  constructor () {
    super(template)
    this.onSelect = this.onSelect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.addUserInput = new AddUserInput({
      onSelect: this.onSelect,
      container: this.el[0].querySelector('.user-search')
    })
  }

  onSelect (user) {
    this.messages([], 'success')
    this.messages([], 'error')
    this.selectedUser = user
    this.el[0].querySelector('.user-card').style.display = 'flex'
    this.el[0].querySelector('.picture').style.backgroundImage = 'url(' + user.avatar + ')'
    this.el[0].querySelector('.name').textContent = user.fullName
    this.el[0].querySelector('input[name="badge"]').value = user.badge || ''
    return Promise.resolve()
  }

  setBadge (badge) {
    return fetch('/api/settings/badges', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.selectedUser.id,
        badge
      })
    })
  }

  onSubmit (e) {
    if (!this.selectedUser) return
    var badge = this.el[0].querySelector('input[name="badge"]').value
    if (badge === this.selectedUser.badge) return

    this.setBadge(badge)
      .then((res) => {
        if (res.ok) {
          this.onsuccess()
        } else {
          this.onerror()
        }
      })
      .catch(() => { this.onerror() })
  }

  /**
   * Turn on event bindings
   */

  switchOn () {
    this.el[0].querySelector('#submit-badge').addEventListener('click', this.onSubmit)
    this.on('success', this.onsuccess.bind(this))
    this.on('error', this.onerror.bind(this))
  }

  /**
   * Turn off event bindings
   */

  switchOff () {
    this.off()
  }

  /**
   * Handle `error` event with
   * logging and display
   *
   * @param {String} error
   * @api private
   */

  onsuccess () {
    this.messages([t('settings.badge.success')], 'success')
  }

  /**
   * Handle current password is incorrect
   */

  onerror () {
    this.messages([t('common.internal-error')])
  }
}
