import React { Component } from 'react'

export default class LoadMore extends Component {
	constructor(props){
		super(props)
		this.setState({
			loading: false
		})
	}
	loadMore(){
		this.setState({
			loading: true
		})
		this.props.handleLoadMoreSearch()
	}

	render(){
		let renderState
		if (!this.state.loading) {
			renderState = (
				<button
					onClick={this.loadMore}
					className='btn btn-block'>
					{t('newsfeed.button.load-more')}
				</button>
			)
		} else {
			renderState = (
				<button
					className='loader-btn btn btn-block'>
					<div className='loader' />
					{t('newsfeed.button.load-more')}
				</button>
			)
		}

		return(
			<div id='load-more'>
				{renderState}
			</div>
		)
	}
}