import React, { Component } from 'react'
import t from 't-component'
import 'whatwg-fetch'

export default class TagsModeration extends Component {
  render () {
    const { forum } = this.props
    return (
      <div className='comments-admin'>
        <div className='well well-sm'>
          tags moderation
        </div>
      </div>
    )
  }
}
