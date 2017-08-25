import bus from 'bus'
import t from 't-component'
import view from '../../../view/mixin'
import forumStore from '../../../stores/forum-store/forum-store'
import { domRender } from '../../../render/render'
import confirm from '../../../modals/confirm'
import error from '../../../modals/error'
import AddUserInput from '../add-user-input/add-user-input'
import template from './template.jade'
import userTemplate from './user.jade'

export default class Role extends view('appendable', 'withEvents') {
  constructor (options = {}) {
    options.template = template
    options.locals = { role: options.role }
    super(options)

    this.onSelect = this.onSelect.bind(this)
    this.onRevoke = this.onRevoke.bind(this)
    this.onStoreGrant = this.onStoreGrant.bind(this)

    this.list = this.el.querySelector('[data-list]')

    this.initUsers()
    if (this.options.canAdd) this.initAddUserInput()
  }

  initUsers () {
    const fragment = document.createDocumentFragment()
    this.options.users.forEach((user) => {
      if (!user) return
      fragment.appendChild(this.renderUser(user))
    })
    this.list.appendChild(fragment)
  }

  initAddUserInput () {
    this.addUserInput = new AddUserInput({
      onSelect: this.onSelect,
      container: this.el.querySelector('[data-title]')
    })
  }

  switchOn () {
    this.bind('click', '[data-revoke]', this.onRevoke)
    bus.on('forum-store:permission:grant', this.onStoreGrant)
  }

  switchOff () {
    this.unbind('click', '[data-revoke]', this.onRevoke)
    bus.off('forum-store:permission:grant', this.onStoreGrant)
  }

  renderUser (user) {
    return domRender(userTemplate, {
      canRevoke: this.options.canRevoke,
      user })
  }

  onSelect (user) {
    const forumId = this.options.forum.id
    const role = this.options.role

    if (this.list.querySelector(`[data-user="${user.id}"]`)) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      forumStore.grantPermission(forumId, user.id, role)
        .then(() => {
          resolve()
          this.list.appendChild(this.renderUser(user))
        })
        .catch((err) => {
          reject(err)
          throw err
        })
    })
  }

  onRevoke (evt) {
    const btn = evt.target
    const userId = btn.getAttribute('data-revoke')
    const forumId = this.options.forum.id
    const role = this.options.role

    const permissionName = t(`admin-permissions.roles.${role}.name`)
    const userName = btn.getAttribute('data-user')

    confirm({
      text: t('admin-permissions.revoke.confirm.text', {
        role: permissionName,
        user: userName
      }),
      acceptText: t('admin-permissions.revoke')
    }).accepts(() => {
      this.revoke(forumId, userId, role)
    })
  }

  revoke (forumId, userId, role) {
    const item = this.list.querySelector(`[data-user="${userId}"]`)
    if (item.classList.contains('revoking')) return

    item.classList.add('revoking')

    forumStore.revokePermission(forumId, userId, role)
      .then(() => {
        this.list.removeChild(item)
      })
      .catch(() => {
        item.classList.remove('revoking')
        error()
      })
  }

  onStoreGrant (forumId, userId, role) {
    if (role === this.options.role) return
    const item = this.list.querySelector(`[data-user="${userId}"]`)
    if (item) this.list.removeChild(item)
  }
}
