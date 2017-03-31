import React, { Component } from 'react'
import { Link } from 'react-router'

export default class ForumSearchCard extends Component {
// props received:
// {
// 	name: 'for the routes'
// 	title: 'the democracy title'
// 	owner: 'the name of the owener'
// 	summary: 'summary'

// }


	render() {
		if(this.props.forum.name.length>145){
			this.props.forum.name = this.props.forum.name.slice(0,145)+'...'
		}
		return(
			<Link id="forum-search-card" to={`/${this.props.forum.name}`}>
				<hr/>
				<h3>{this.props.forum.title}</h3>
				<h4>{this.props.forum.owner}</h4>
				<p>
					<span/>
					{this.props.forum.summary}
				</p>
			</Link>
		)
	}
}
