import bus from 'bus'
import debug from 'debug'
import ToggleParent from 'democracyos-toggle-parent'
import t from 't-component'
import closest from 'component-closest'
import View from '../view/view.js'
import user from '../user/user.js'
import Storage from '../storage/storage.js'
import sorts from './sorts.js'
import template from './template.jade'

let log = debug('democracyos:comments-filter')
let storage = new Storage()

export default class CommentsFilter extends View {
  constructor () {
    super(template, { label: sorts.score.label, sorts: sorts })
    this.$_filter = sorts.score
  }

  /**
   * Switch on events
   *
   * @api public
   */

  switchOn () {
    bus.on('page:change', this.bound('switchOff'))
    this.bind('click', 'li a', 'onsortclick')
    this.on('change', this.bound('onsortchange'))
    user.on('load', this.bound('refresh'))
    let dropdownBtn = this.find('.btn')
    this.dropdown = new ToggleParent(dropdownBtn[0])
    this.refresh()
  }

  switchOff () {
    bus.off('page:change', this.bound('switchOff'))
    user.off('loaded', this.bound('refresh'))
    if (this.dropdown) {
      this.dropdown.destroy()
      this.dropdown = null
    }
  }

  /**
   * Click on a comments sort
   *
   * @api public
   */

  onsortclick (ev) {
    ev.preventDefault()

    let target = ev.delegateTarget || closest(ev.target, 'a')
    let li = closest(target, 'li')
    let sort = li.getAttribute('data-sort')
    this.set(sort)
  }

  /**
   * Change sorting criteria
   *
   * @api public
   */

  onsortchange () {
    let btn = this.find('.btn strong')
    let sort = this.get()
    btn.html(t(sort.label))
    this.dropdown.hide()
  }

  /**
   * Reset sorting criteria
   *
   * @api public
   */

  reset () {
    this.set(sorts.score)
  }

  /**
   * Refresh sorting criteria
   *
   * @api public
   */

  refresh (sort) {
    let self = this

    if (!user.logged()) {
      this.reset()
    } else {
      var data = storage.get('comments-filter')
      if (!data) log('unable to fetch')
      self.set(data || sorts.score)
    }
  }

  /**
   * Get all current `$_filter` or just the
   * one provided by `key` param
   *
   * @param {String} key
   * @return {Array|String} all `$_filter` or just the one by `key`
   * @api public
   */

  get () {
    return this.$_filter
  }

  /**
   * Set `$_filter` to whatever provided
   *
   * @param {String|Object} key to set `value` or `Object` of `key-value` pairs
   * @param {String} value
   * @return {CommentsFilter} Instance of `CommentsFilter`
   * @api public
   */

  set (sort) {
    let old = this.$_filter
    this.$_filter = sorts[sort] || sort

    if (user.logged()) {
      storage.set('comments-filter', this.get(), (err, ok) => err ? log('unable to save') : log('saved'))
    }
    if (old !== this.$_filter) this.emit('change')
    return this
  }

  /**
   * Get current sort
   *
   * @return {String}
   * @api public
   */

  getSort () {
    return this.get().sort
  }
}
