import keyboardEvents from 'keyboardevent-key-polyfill'
import bean from 'bean'

keyboardEvents.polyfill()

export class Dropdown {
  constructor (options = {}) {
    if (!options.container) {
      throw new Error('Dropdown needs a container element.')
    }

    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)
    this.toggle = this.toggle.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.bindShowEvents = this.bindShowEvents.bind(this)
    this.bindHideEvents = this.bindHideEvents.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
    this.onItemMouseenter = this.onItemMouseenter.bind(this)

    this.options = options
    this.items = new WeakMap()
    this.showing = false
    this.focused = null
    this.el = this.render()
    this.container = options.container

    window.requestAnimationFrame(() => {
      this.init()
    })
  }

  render () {
    throw new Error('Must implement render() method.')
  }

  renderItem () {
    throw new Error('Must implement renderItem() method.')
  }

  focusItem () {
    throw new Error('Must implement focusItem() method.')
  }

  unfocusItem () {
    throw new Error('Must implement unfocusItem() method.')
  }

  init () {
    this.container.appendChild(this.el)
    this.bindHideEvents(true)
    return this
  }

  destroy () {
    this.hide()
    this.bindHideEvents(false)
    this.container.removeChild(this.el)
    return this
  }

  show () {
    if (!this.el.hasChildNodes()) return this
    if (this.showing) return this
    this.el.style.display = 'block'

    this.bindHideEvents(false)
    window.requestAnimationFrame(() => {
      this.bindShowEvents(true)
    })

    this.showing = true
    return this
  }

  bindShowEvents (bind = true) {
    let action = bind ? 'on' : 'off'
    bean[action](this.container, 'mousedown', this.hide)
    bean[action](document.documentElement, 'keydown', this.onKeyDown)
    bean[action](document.documentElement, 'mousedown', this.hide)
    bean[action](this.el, 'mousedown', '.item', this.onItemClick)
    bean[action](this.el, 'mouseenter', '*', this.onItemMouseenter)
  }

  hide () {
    if (!this.showing) return this
    this.el.style.display = 'none'

    this.bindShowEvents(false)
    window.requestAnimationFrame(() => {
      this.bindHideEvents(true)
    })

    this.showing = false
    return this
  }

  bindHideEvents (bind = true) {
    let action = bind ? 'on' : 'off'
    bean[action](this.container, 'mousedown', this.show)
  }

  toggle (...args) {
    if (this.showing) return this.hide(...args)
    return this.show(...args)
  }

  add (data) {
    if (Array.isArray(data)) {
      const fragment = document.createDocumentFragment()
      data.forEach((_data) => {
        const el = this.renderItem(_data)
        this.items.set(el, _data)
        fragment.appendChild(el)
      })
      this.el.appendChild(fragment)
    } else {
      const el = this.renderItem(data)
      this.items.set(el, data)
      this.el.appendChild(el)
    }

    return this
  }

  clear () {
    while (this.el.firstChild) this.el.removeChild(this.el.firstChild)
    return this
  }

  focus (item) {
    if (!item) return this.unfocus()
    if (this.focused && this.focused === item) return this
    this.unfocus()
    this.focusItem(item)
    this.focused = item
    return this
  }

  unfocus () {
    if (this.focused) {
      this.unfocusItem(this.focused)
      this.focused = null
    }
    return this
  }

  focusNext () {
    let item = (this.focused &&
               this.focused.nextSibling) ||
               this.el.childNodes[0]
    return this.focus(item)
  }

  focusPrev () {
    let item = (this.focused &&
               this.focused.previousSibling) ||
               this.el.childNodes[this.el.childNodes.length - 1]
    return this.focus(item)
  }

  select () {
    this.hide()
    if (!this.focused) return this

    const item = this.focused
    const data = this.items.get(item)

    this.unfocus()
    if (this.options.onSelect) {
      this.options.onSelect(data, item)
    }

    return this
  }

  onKeyDown (evt) {
    switch (evt.key) {
      case 'Escape':
        this.hide()
        break
      case 'Enter':
        this.select()
        break
      case 'ArrowUp':
        evt.preventDefault()
        evt.stopImmediatePropagation()
        this.focusPrev()
        break
      case 'ArrowDown':
        evt.preventDefault()
        evt.stopImmediatePropagation()
        this.focusNext()
        break
    }
  }

  onItemClick (evt) {
    const item = evt.currentTarget
    if (item.parentNode !== this.el) return
    this.focus(item).select()
  }

  onItemMouseenter (evt) {
    const item = evt.currentTarget
    if (item.parentNode !== this.el) return
    this.focus(item)
  }
}

export class DropdownDefaultTemplate extends Dropdown {
  render () {
    const el = document.createElement('div')
    el.classList.add('dropdown')
    el.style.display = 'none'
    return el
  }

  renderItem (data = {}) {
    const el = document.createElement('div')
    el.classList.add('item')

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        el.dataset[k] = data[k]
      }
    }

    if (data.text) el.textContent = data.text
    return el
  }

  focusItem (item) {
    return item.classList.add('active')
  }

  unfocusItem (item) {
    return item.classList.remove('active')
  }
}

export class DropdownInput extends DropdownDefaultTemplate {
  constructor (options = {}) {
    super(options)

    if (!this.options.input) {
      throw new Error('DropdownInput needs an input element.')
    }

    this.onInputKeydown = this.onInputKeydown.bind(this)

    this.input = this.options.input
  }

  init (...args) {
    super.init(...args)
    bean.on(this.input, 'keydown', this.onInputKeydown)
    return this
  }

  destroy (...args) {
    super.destroy(...args)
    bean.off(this.input, 'keydown', this.onInputKeydown)
    return this
  }

  bindShowEvents (bind = true) {
    super.bindShowEvents(bind)
    let action = bind ? 'on' : 'off'
    bean[action](this.input, 'blur', this.hide)
  }

  bindHideEvents (bind = true) {
    super.bindHideEvents(bind)
    let action = bind ? 'on' : 'off'
    bean[action](this.input, 'focus', this.show)
  }

  onInputKeydown (evt) {
    switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (!this.showing) this.show()
        break
    }
  }
}
