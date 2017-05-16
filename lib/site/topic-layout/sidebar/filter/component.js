import React, { Component } from 'react'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'

class Filter extends Component {
  constructor (props) {
    super(props)

    this.state = {
      sortMenuShowing: false
    }
  }

  handleToggleMenu = () => {
    this.setState({ sortMenuShowing: !this.state.sortMenuShowing })
  }

  handleSortItemClick = (evt) => {
    this.props.onFilterSortChange(evt)
    this.handleToggleMenu()
  }

  formatNumber (v) {
    return (v < 100 ? v : '99+') + ' '
  }

  render () {
    const currentSort = this.props.sorts[this.props.currentSort]

    return (
      <div className='sidebar-filter'>
        <div className='sidebar-filter-status btn-group'>
          <button
            data-status='open'
            className={`btn btn-default ${this.props.openCloseToggle ? 'active' : ''}`}
            onClick={this.props.onFilterStatusChange}>
            {this.formatNumber(this.props.openCount) + t('sidebar.open')}
          </button>
          <button
            data-status='closed'
            className={`btn btn-default ${this.props.openCloseToggle ? '' : 'active'}`}
            onClick={this.props.onFilterStatusChange}>
            {this.formatNumber(this.props.closedCount) + t('sidebar.closed')}
          </button>
        </div>
        <div className='sidebar-filter-sort btn-group'>
          <button
            type='button'
            data-sort-btn
            className={`btn btn-default btn-block ${this.state.sortMenuShowing ? 'active' : ''}`}
            onClick={this.handleToggleMenu} >
            <span className='pull-left'>{t(currentSort.label)}</span>
            <span className='caret' />
          </button>
          {
            this.state.sortMenuShowing && (<ul className='dropdown-list'>
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
                        onClick={this.handleSortItemClick}>
                        <span>{t(sort.label)}</span>
                      </li>
                    )
                  })
              }
            </ul>)
          }
        </div>
        {
          this.props.user.state.fulfilled && (
            <div className={'sidebar-filter-hide-voted'}>
              <input
                onChange={this.props.onFilterHideVotedChange}
                data-hide-voted
                checked={this.props.hideVoted}
                type='checkbox'
                name='hide-voted'
                id='hide-voted' />
              <label htmlFor='hide-voted'>
                {t('sidebar.hide-voted')}
              </label>
            </div>
          )
        }
      </div>
    )
  }
}

export default userConnector(Filter)
