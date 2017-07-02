import debounce from 'mout/function/debounce'
import view from '../../../view/mixin'
import userStore from '../../../stores/user-store/user-store'
import { domRender } from '../../../render/render'
import { DropdownInput } from './dropdown/dropdown'
import template from './template.jade'
import itemTemplate from './dropdown-item.jade'

class UserSearchInput extends DropdownInput {
  renderItem (data = {}) {
    return domRender(itemTemplate, data)
  }
}

export default class AddUserInput extends view('appendable', 'withEvents', 'loadable') {
  constructor (options = {}) {
    options.template = template
    super(options)

    this.onInput = this.onInput.bind(this)
    this.onInputDebounced = debounce(this.onInputDebounced.bind(this), 350)
  }

  switchOn () {
    this.initDropdown()
  }

  switchOff () {
    this.destroyDropdown()
  }

  initDropdown () {
    this.input = this.input || this.el.querySelector('[data-input]')

    this.dropdown = new UserSearchInput({
      container: this.el,
      input: this.input,
      onSelect: this.onSelect.bind(this)
    })

    this.bind('input', '[data-input]', this.onInput)
  }

  destroyDropdown () {
    if (this.dropdown) {
      this.dropdown.destroy()
      this.dropdown = null
    }

    this.unbind('input', '[data-input]', this.onInput)
  }

  onInput () {
    this.loading(true)
    this.onInputDebounced()
  }

  onInputDebounced () {
    const val = this.input.value

    if (this._lastVal && this._lastVal === val) return

    this._lastVal = val

    if (!val || val.length < 2) {
      this.dropdown.hide().clear()
      this.loading(false)
      return
    }

    this.loading(true)

    return userStore.search(this.input.value)
      .catch(console.error.bind(console))
      .then((users) => {
        if (users && users.length) {
          this.dropdown.clear().add(users).show()
        } else {
          this.dropdown.hide().clear()
        }
        this.loading(false)
      })
  }

  onSelect (user) {
    this.loading(true)
    this.destroyDropdown()
    this.input.disabled = true
    this.input.value = user.fullName

    return Promise.all([this.options.onSelect(user)])
      .catch(console.error.bind(console))
      .then(() => {
        this.input.disabled = false
        this.input.value = ''
        this.initDropdown()
        this.loading(false)
      })
  }
}
