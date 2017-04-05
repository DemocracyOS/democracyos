import React, { Component } from 'react'
import t from 't-component'
import ForumSearchCard from './forum-search-card/component'
import LoadMore from './load-more'

export default class SearchResults extends Component {
  render () {
    let msg
    if (!this.props.forums.length) {
      msg = (
        <p className='msg-empty'>{t('newsfeed.nothing-to-show')}</p>
      )
    } else {
      msg = this.props.forums.map((forum, i) => {
        return (
          <ForumSearchCard key={i} forum={forum} />
        )
      })
    }
    return (
      <div id='search-results'>
        {msg}
        <LoadMore noMoreResults={this.props.noMoreResults}
          isLoading={this.props.isLoading}
          loadMore={this.props.handleLoadMoreSearch} />
      </div>
    )
  }
}
