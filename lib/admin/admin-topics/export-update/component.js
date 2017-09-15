import React, { Component } from 'react'
import urlBuilder from 'lib/url-builder'
import t from 't-component'

export default class ExportUpdate extends Component {
	render () {
		const { forum } = this.props
		return (
			<div className='export-update'>
				<a href={urlBuilder.for('admin.topics.csv', { forum: forum.name })}
					className='btn btn-primary'>
					{ t('admin-comments.dowload-as-csv') }
				</a>
				<label className='btn btn-primary label-file'>
					{ t('admin-topics.update-from-csv') }
					<input type='file' id='input-file'/>
				</label>
			</div>
		)
	}
}