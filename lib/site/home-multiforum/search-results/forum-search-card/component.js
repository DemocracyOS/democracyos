import React, { Component } from 'react'
import { Link } from 'react-router'

export default class ForumSearchCard extends Component {
  render () {
    const { forum } = this.props

    if (forum.summary.length > 145) {
      forum.summary = forum.summary.slice(0, 145) + '...'
    }

    return (
      <Link
        id='forum-search-card'
        to={forum.url}
        className='card'>
        <hr />
        <h3>{forum.title}</h3>
        <h4>{forum.owner.fullName}</h4>
        <p>
          <span />
          {forum.summary}
        </p>
      </Link>
    )
  }
}
