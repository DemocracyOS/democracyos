import React from 'react'
import { Link } from 'react-router'

export default (props) => {
  const { forum } = props

  return (
    <Link className='forum-search-card card' to={forum.url}>
      <div className='card-block'>
        <h3 className='card-title'>{forum.title}</h3>
        <h6 className='card-subtitle'>
          {forum.owner.fullName}
        </h6>
        <p className='card-text'>
          {forum.summary}
        </p>
      </div>
    </Link>
  )
}
