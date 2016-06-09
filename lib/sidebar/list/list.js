import arrayEquals from 'mout/array/equals'
import objectEquals from 'mout/object/equals'
import view from '../../view/mixin'
import { domRender } from '../../render/render'
import template from './template.jade'
import itemTemplate from './item.jade'

export default class List extends view('appendable', 'emptyable') {
  constructor (options = {}) {
    options.template = template
    super(options)

    this.items = []
    this.selected = null
  }

  empty () {
    super.empty()
    this.items = []
    return this
  }

  reset (items = []) {
    let sameItems = arrayEquals(this.items, items, (a, b) => a.id === b.id)
    if (sameItems) {
      this.items = this.items.map((oldItem, i) => {
        let newItem = items[i]
        if (objectEquals(oldItem, newItem)) return oldItem
        let oldEl = this.el.querySelector(`[data-id="${oldItem.id}"]`)
        let newEl = this.renderItem(newItem)
        this.el.replaceChild(newEl, oldEl)
        return newItem
      })
    } else {
      this.empty()
      this.add(items)
    }
  }

  add (items) {
    if (!items) return
    if (Array.isArray(items)) {
      if (!items.length) return
      let fragment = document.createDocumentFragment()
      items.forEach(item => {
        this.items.push(item)
        fragment.appendChild(this.renderItem(item))
      })
      this.el.appendChild(fragment)
    } else {
      this.items.push(items)
      window.requestAnimationFrame(() => {
        this.el.appendChild(this.renderItem(items))
      })
    }
  }

  renderItem (item) {
    return domRender(itemTemplate, {
      item: item,
      active: this.selected === item.id
    })
  }

  select (id = null) {
    if (id === this.selected) return

    if (this.selected) {
      let selected = this.el.querySelector(`[data-id="${this.selected}"]`)
      if (selected) selected.classList.remove('active')
    }

    if (id) {
      let el = this.el.querySelector(`[data-id="${id}"]`)
      if (el) el.classList.add('active')
    }

    this.selected = id
  }
}
