/*eslint semi: [2, "never"]*/
import bean from 'bean'

export class Dropdown {
  constructor (options = {}) {
    if (!options.container) {
      throw new Error('Dropdown needs a container element.')
    }

    this.hide = this.hide.bind(this)
    this.show = this.show.bind(this)
    this.toggle = this.toggle.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)

    this.options = options
    this.items = new WeakMap()
    this.showing = false
    this.selected = null
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

  selectItem () {
    throw new Error('Must implement selectItem() method.')
  }

  unselectItem () {
    throw new Error('Must implement unselectItem() method.')
  }

  init () {
    this.container.appendChild(this.el)
    bean.on(this.container, 'click', this.toggle)
    if (!this.showing) this.hide(true)
  }

  destroy () {
    this.hide()
    bean.off(this.container, 'click', this.toggle)
  }

  show (force = false) {
    if (!force && this.showing) return this
    this.el.style.display = 'block'

    bean.on(document.documentElement, 'keydown', this.onKeyDown)
    // Wait for all events to finish first.
    window.requestAnimationFrame(() => {
      bean.on(document.documentElement, 'click', this.hide)
    })

    bean.off(this.container, 'click', this.show)

    this.showing = true
    return this
  }

  hide (force = false) {
    if (!force && !this.showing) return this
    this.el.style.display = 'none'

    bean.off(document.documentElement, 'keydown', this.onKeyDown)
    bean.off(document.documentElement, 'click', this.hide)

    // Wait for all events to finish first.
    window.requestAnimationFrame(() => {
      bean.on(this.container, 'click', this.show)
    })

    this.showing = false
    return this
  }

  toggle (...args) {
    if (this.showing) return this.hide(...args)
    return this.show(...args)
  }

  add (data) {
    if (Array.isArray(data)) {
      const fragment = document.createDocumentFragment()
      data.forEach(_data => {
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

  select (item) {
    if (!item) return this.unselect()
    if (this.selected && this.selected === item) return this
    this.unselect()
    this.selectItem(item)
    this.selected = item
    return this
  }

  unselect () {
    if (this.selected) {
      this.unselectItem(this.selected)
      this.selected = null
    }
    return this
  }

  next () {
    let item = this.selected &&
               this.selected.nextSibling ||
               this.el.childNodes[0]
    return this.select(item)
  }

  prev () {
    let item = this.selected &&
            this.selected.previousSibling ||
            this.el.childNodes[this.el.childNodes.length - 1]
    return this.select(item)
  }

  onKeyDown (evt) {
    switch (evt.keyCode) {
      // esc
      case 27:
        this.hide()
        break
      // up
      case 38:
        evt.preventDefault()
        evt.stopImmediatePropagation()
        this.prev()
        break
      // down
      case 40:
        evt.preventDefault()
        evt.stopImmediatePropagation()
        this.next()
        break
    }
  }
}

export class DropdownMenu extends Dropdown {
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

  selectItem (item) {
    return item.classList.add('active')
  }

  unselectItem (item) {
    return item.classList.remove('active')
  }
}


export class DropdownInput extends DropdownMenu {
  constructor (options = {}) {
    super(options)

    if (!this.options.input) {
      throw new Error('DropdownInput needs an input element.')
    }

    this.input = this.options.input
  }

  show (...args) {
    bean.on(this.input, 'blur', this.hide)
    bean.off(this.input, 'focus', this.show)

    return super.show(...args)
  }

  hide (...args) {
    bean.off(this.input, 'blur', this.hide)
    bean.on(this.input, 'focus', this.show)

    return super.hide(...args)
  }
}
