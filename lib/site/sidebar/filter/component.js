import React, {Component} from 'react'
import t from 't-component'
import user from 'lib/user/user'

export default class Filter extends Component {
  formatNumber (v) {
    return (v < 100 ? v : '99+') + ' '
  }

  render () {
    var currentSort = this.props.sorts[this.props.currentSort]
    return (
      <div className='sidebar-filter'>
        <div className='sidebar-filter-status btn-group'>
          <button
            data-status='open'
            className={(this.props.openCloseToggle ? 'active' : '') + ' btn btn-default'}>
            {this.formatNumber(this.props.openCount) + t('sidebar.open')}
          </button>
          <button
            data-status='closed'
            className={(!this.props.openCloseToggle ? 'active' : '') + ' btn btn-default'}>
            {this.formatNumber(this.props.closedCount) + t('sidebar.closed')}
          </button>
        </div>
        <div className='sidebar-filter-sort btn-group'>
          <button 
            type='button'
            data-sort-btn
            className='btn btn-default current-department'>
            <span className='pull-left'>{t(currentSort.label)}</span>
            <span className='caret'></span>
          </button>
          <ul className='dropdown-list'>
            {
              Object.keys(this.props.sorts)
                .map((sortKey) => {
                  var sort = this.props.sorts[sortKey]
                  var active = sort.name === currentSort.name

                  return (
                    <li key={sortKey} data-sort={sort.name} className={(active ? 'active' : '')}>
                      <a href=''>{t(sort.label)}</a>
                    </li>
                  )
                })
            }
          </ul>
        </div>
        <div className={(user.logged() ? '' : 'hide') + ' sidebar-filter-hide-voted'}>
          <input data-hide-voted checked={this.props.hideVoted} type='checkbox' name='hide-voted' id='hide-voted' />
          <label htmlFor='hide-voted'>
            {t('sidebar.hide-voted')}
          </label>
        </div>
      </div>
    )
  }
}
