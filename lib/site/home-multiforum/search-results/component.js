import React, { Component } from 'react'
import ForumSearchCard from './forum-search-card'


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
		return(
			<div id="search-results">
				{
					if(true){
						return(
							<p className="msg-empty">No se encontraron resultas</p>
							)
					} else {
						this.props.forums.map((forum)=> {
							return (
									<ForumSearchCard forum={forum} />
								)
						})
				}
			}
			</div>
			)
	}
}