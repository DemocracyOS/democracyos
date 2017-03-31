import React, { Component } from 'react'
import t from 't-component'
import ForumSearchCard from './forum-search-card'
import LoadMore from './load-more'

export default class SearchResults extends Component {
	constructor (props) {
		super(props)
	}
	render(){
		let msg
		if(!this.props.forums.length){
<<<<<<< fa84f8bb00e933ac28f32c4bfa649db7b4efbf10
			msg = (<p className="msg-empty">{t('newsfeed.nothing-to-show')}</p>)
=======
			msg = (
				<p className="msg-empty".>{t('newsfeed.nothing-to-show')}</p>
				)
>>>>>>> made the loadmore component stateless
		} else {
  		msg = this.props.forums.map((forum, i) => {
				return (
					<ForumSearchCard key={i} forum={forum} />
					)
				})
		}
		return(
				<div id="search-results">
					{msg}
					<LoadMore noMoreResults={this.props.noMoreResults} 
						isLoading={this.props.isLoading} 
						loadMore={this.props.handleLoadMoreSearch} />
				</div>
			)
	}
}
