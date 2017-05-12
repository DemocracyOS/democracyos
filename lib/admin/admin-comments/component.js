import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'
import urlBuilder from 'lib/url-builder'

export default class AdminComments extends Component {
  render () {
    const { forum } = this.props
    return (
      <div className='comments-admin'>
        <div className='well well-sm'>
          <a href={urlBuilder.for('admin.comments.csv', { forum: forum.name })}
            className='btn btn-primary pull-right'>
            { t('admin-comments.dowload-as-csv') }
          </a>
        </div>
      </div>
    )
  }
}
