import ToggleParent from 'democracyos-toggle-parent'
import view from '../../../view/mixin'
import template from './template.jade'
import topicFilter from '../../topic-filter/topic-filter'

export default class Filter extends view('appendable', 'removeable', 'withEvents') {
  constructor (options) {
    options.template = template
    options.locals = options.filter
    super(options)

    this.filter = this.options.filter

    this.onHideVotedClick = this.onHideVotedClick.bind(this)
    this.onStatusClick = this.onStatusClick.bind(this)
    this.onSortClick = this.onSortClick.bind(this)

    this.switchOn()
  }

  switchOn () {
    this.bind('click', '[data-hide-voted]', this.onHideVotedClick)
    this.bind('click', '[data-status]', this.onStatusClick)
    this.bind('click', '[data-sort]', this.onSortClick)

    var dropdownBtn = this.el.querySelector('[data-sort-btn]')
    this.filterDropdown = new ToggleParent(dropdownBtn)
  }

  onHideVotedClick (e) {
    topicFilter.setFilter({ hideVoted: e.delegateTarget.checked })
  }

  onStatusClick (e) {
    let el = e.delegateTarget
    let status = el.getAttribute('data-status')
    if (this.filter.status === status) return
    topicFilter.setFilter({ status: status })
  }

  onSortClick (e) {
    e.preventDefault()
    let el = e.delegateTarget
    let sort = el.getAttribute('data-sort')
    if (this.filter.sort === sort) return
    topicFilter.setFilter({ sort: sort })
  }
}
