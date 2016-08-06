import React, {Component} from 'react'
import t from 't-component'
import user from '../../../user/user'
import bus from 'bus'
import topicFilter from '../../topic-filter/topic-filter'

export default class Filter extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: user,
      openCount: 0,
      closedCount: 0,
      openCloseToggle: true,
      currentSort: {
        label: ''
      },
      sorts: {},
      hideVoted: false
    }
    this.onFilterUpdate = this.onFilterUpdate.bind(this)
  }

  componentDidMount () {
    bus.on('topic-filter:update', this.onFilterUpdate)
  }

  componentWillUnmount () {
    bus.off('topic-filter:update', this.onFilterUpdate)
  }

  onFilterUpdate (items, filter) {
    console.log('onFilterUpdate', filter)
    this.setState({
      filter: filter,
      openCount: filter.openCount,
      closedCount: filter.closedCount,
      currentSort: filter.currentSort,
      sorts: filter.sorts,
      hideVoted: filter.filter.hideVoted,
      sort: filter.sort,
      status: filter.status
    })
  }

  onHideVotedClick (e) {
    topicFilter.setFilter({ hideVoted: e.delegateTarget.checked })
  }

  onStatusClick (e) {
    let el = e.delegateTarget
    let status = el.getAttribute('data-status')
    if (this.state.status === status) return
    topicFilter.setFilter({ status: status })
  }

  onSortClick (e) {
    e.preventDefault()
    let el = e.delegateTarget
    let sort = el.getAttribute('data-sort')
    if (this.state.sort === sort) return
    topicFilter.setFilter({ sort: sort })
  }

  formatNumber (v) {
    return (v < 100 ? v : '99+') + ' '
  }

  render () {
    return (
      <div className='sidebar-filter'>
        <div className='sidebar-filter-status btn-group btn-group-justified'>
          <a href='#' data-status='open' onClick={this.onStatusClick} className={(this.state.openCloseToggle ? 'active' : '') + ' btn btn-default'}>
            {this.formatNumber(this.state.openCount) + t('sidebar.open')}
          </a>
          <a href='#' data-status='closed' onClick={this.onStatusClick} className={(!this.state.openCloseToggle ? 'active' : '') + ' btn btn-default'}>
            {this.formatNumber(this.state.closedCount) + t('sidebar.closed')}
          </a>
        </div>
        <div className='sidebar-filter-sort btn-group'>
          <button type='button' data-sort-btn className='btn btn-default current-department'>
            <span className='pull-left'>{t(this.state.currentSort.label)}</span>
            <span className='caret'></span>
          </button>
          <ul className='dropdown-list'>
            {
              Object.keys(this.state.sorts)
                .map((sortKey) => {
                  var iSort = this.state.sorts[sortKey]
                  var active = iSort.name === this.state.currentSort.name
                  
                  return (
                    <li key={sortKey} data-sort={iSort.name} onClick={this.onSortClick} className={(active ? 'active' : '')}>
                      <a href=''>{t(iSort.label)}</a>
                    </li>
                  )
                })
            }
          </ul>
        </div>
        <div className={(this.state.user.logged() ? '' : 'hide') + ' sidebar-filter-hide-voted'}>
          <input data-hide-voted checked={this.state.hideVoted} onClick={this.onHideVotedClick} type='checkbox' name='hide-voted' id='hide-voted' />
          <label htmlFor='hide-voted'>
            {t('sidebar.hide-voted')}
          </label>
        </div>
      </div>
    )
  }
}
