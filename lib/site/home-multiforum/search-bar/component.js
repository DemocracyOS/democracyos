import React, { Component } from 'react'
import t from 't-component'

export default class SearchBar extends Component {
  handleKeyUp = (e) => {
    this.props.isSearching(e.target.value)
  }

  render () {
    const classes = ['form-control', 'search']
    if (this.props.isLoading) classes.push('loading-spinner')

    return (
      <div className='input-group input-group-md'>
        <span className='input-group-addon'>
          <i className='icon-magnifier' aria-hidden='true' />
        </span>
        <input
          className={classes.join(' ')}
          type='text'
          maxLength='100'
          onKeyUp={this.handleKeyUp}
          placeholder={t('newsfeed.search.placeholder')}
          autoFocus />
      </div>
    )
  }
}
