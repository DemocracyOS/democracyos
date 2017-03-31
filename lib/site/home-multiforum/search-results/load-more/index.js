<<<<<<< HEAD
import React, { Component } from 'react'
=======
import React { Component } from 'react'
import t from 't-component'
>>>>>>> 1e465e7010417884c2538509e2c9a5b7615e4903

export default class LoadMore extends Component {
	constructor(props){
		super(props)
	}
	render(){
		let renderState
		if (!this.props.isLoading) {
			renderState = (
				<button
					onClick={this.loadMore}
					className='btn btn-block'>
					{t('newsfeed.button.load-more')}
				</button>
			)
		} else if(this.props.noMoreResults){
			renderState = (
				<p className="msg-empty".>{t('newsfeed.nothing-to-show')}</p>
			)
		} else	{
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
