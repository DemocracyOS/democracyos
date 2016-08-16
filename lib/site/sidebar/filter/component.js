import React, {Component} from 'react'
import t from 't-component'
import user from 'lib/user/user'

export default class Filter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sortMenu: false
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu (e) {
    this.setState({sortMenu: !this.state.sortMenu})
  }

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
            className={(this.props.openCloseToggle ? 'active' : '') + ' btn btn-default'}
            onClick={this.props.filterStatusChange}>
            {this.formatNumber(this.props.openCount) + t('sidebar.open')}
          </button>
          <button
            data-status='closed'
            className={(!this.props.openCloseToggle ? 'active' : '') + ' btn btn-default'}
            onClick={this.props.filterStatusChange}>
            {this.formatNumber(this.props.closedCount) + t('sidebar.closed')}
          </button>
        </div>
        <div className={'sidebar-filter-sort btn-group' + (this.state.sortMenu ? ' active' : '')}>
          <button
            type='button'
            data-sort-btn
            className='btn btn-default current-department'
            onClick={this.toggleMenu}>
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
                    <li
                      key={sortKey}
                      data-sort={sort.name}
                      className={(active ? 'active' : '')}
                      onClick={() => this.props.filterSortChange; this.toggleMenu}>
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
