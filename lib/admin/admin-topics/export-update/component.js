import React, { Component } from 'react'
import urlBuilder from 'lib/url-builder'
import 'whatwg-fetch'
import t from 't-component'

export default class ExportUpdate extends Component {
	constructor (props) {
    	super(props)
    	this.state = {
    		visibility: false
    	}
	}

	onLoadFile = () => {
		const input = this.refs.inputCsv
		const file = input.files[0]
		const reader = new FileReader()
		reader.onload = (event) => {
    		const content = event.target.result
    		fetch('/api/v2/topics.csv', {
      		method: 'POST',
      		credentials: 'same-origin',
      		headers: {
        		Accept: 'application/json',
        		'Content-Type': 'application/json'
      		},
      		body: JSON.stringify({csv : content})
    		})
    		.then((res) => {
       	 		console.log(res.status)
       	 		if (res.status != 200) {
       	 			this.setState({
       	 				visibility: true
       	 			})
       	 		}
       	 	})
       	 	//catch
		}
		reader.readAsText(file)
	}

	render () {
		const { forum } = this.props
		return (
			<div className='export-update'>
				{this.state.visibility &&(
					<div className='error-message'>
						<p>
							{ t('modals.error.default') }
						</p>
					</div>
				)}
				<a href={urlBuilder.for('admin.topics.csv', { forum: forum.name })}
					className='btn btn-primary'>
					{ t('admin-comments.dowload-as-csv') }
				</a>
				<label className='btn btn-primary label-file'>
					{ t('admin-topics.update-from-csv') }
					<input type='file' id='input-file' accept='.csv' onChange={this.onLoadFile} ref='inputCsv'/>
				</label>
			</div>
		)
	}
}

