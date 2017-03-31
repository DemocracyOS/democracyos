import React, { Component } from 'react'
import ForumSearchCard from './forum-search-card'
import t from 't-component'


// props received:
// {
// 	name: 'for the routes'
// 	title: 'the democracy title'
// 	owner: 'the name of the owener'
// 	summary: 'summary'
//  emptyResults: boolean

// }

export default class SearchResults extends Component {
	render(){
		let msg
		if(!this.props.forums.length){
						msg = (<p className="msg-empty">
								{t('newsfeed.nothing-to-show')}		
							</p>)
		} else {
			msg = this.props.forums.map((forum)=> {
				return (
					<ForumSearchCard forum={forum} />
					)
				})
		}

		return(
			<div id="test-container">
				<div id="search-results">
					{	msg }
				</div>
			</div>
			)
	}
}