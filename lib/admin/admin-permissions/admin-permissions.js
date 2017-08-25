import dom from 'component-dom'
import t from 't-component'
import view from '../../view/mixin'
import forumStore from '../../stores/forum-store/forum-store'
import roles from '../../models/forum/roles'
import visibilities from '../../models/forum/visibilities'
import confirm from '../../modals/confirm'
import error from '../../modals/error'
import template from './template.jade'
import Role from './role/role'

export default class AdminPermissions extends view('appendable', 'emptyable', 'loadable', 'withEvents') {
  constructor (options = {}) {
    options.template = template
    options.locals = {
      forum: options.forum,
      visibilities: visibilities
    }

    super(options)

    this.onVisibilityChange = this.onVisibilityChange.bind(this)

    this.list = this.el.querySelector('.admin-permissions-lists')
  }

  switchOn () {
    this.reset()
    this.bind('change', '[name="visibility"]', this.onVisibilityChange)
  }

  switchOff () {
    this.unbind('change', '[name="visibility"]', this.onVisibilityChange)
  }

  reset () {
    this.loading(true)

    forumStore.getPermissions(this.options.forum.id)
      .then((permissions) => {
        const fragment = document.createDocumentFragment()

        this.renderOwner().appendTo(fragment)

        roles.forEach((role) => {
          const users = permissions
            .filter((p) => p.role === role)
            .map((p) => p.user)

          return new Role({
            container: fragment,
            forum: this.options.forum,
            canRevoke: true,
            canAdd: true,
            role,
            users
          })
        })

        dom(this.list).empty()
        this.list.appendChild(fragment)
        this.loading(false)
      })
      .catch(console.error.bind(console))
  }

  renderOwner () {
    return new Role({
      forum: this.options.forum,
      canRevoke: false,
      canAdd: false,
      role: 'owner',
      users: [this.options.forum.owner]
    })
  }

  onVisibilityChange (evt) {
    const input = evt.target
    const newValue = input.value
    const forum = this.options.forum

    const cancel = () => {
      const oldInput = this.el.querySelector(`[name="visibility"][value="${forum.visibility}"]`)
      oldInput.checked = true
    }

    confirm({
      text: t('admin-permissions.visibility.confirm', {
        visibility: t(`admin-permissions.visibility.${newValue}.title`)
      })
    }).accepts(() => {
      this.update({ visibility: newValue })
        .catch(() => {
          cancel()
          error()
        })
    }).rejects(cancel)
  }

  update (data) {
    return forumStore.update(this.options.forum.id, data)
  }
}
