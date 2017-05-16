import React from 'react'
import { Link } from 'react-router'

export default ({ topic }) => (
  <div className='ext-topic-card ideas-topic-card'>
    {topic.coverUrl && (
      <Link
        to={topic.url}
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
    )}
    <div className='topic-card-info'>
      <h1 className='topic-card-title'>
        <Link to={topic.url}>{topic.mediaTitle}</Link>
      </h1>
    </div>
    <div className='topic-card-footer'>
      <div className='participants'>
        <span className='icon-heart' />
        &nbsp;
        {topic.participants.length}
      </div>
      <Link to={topic.url} className='btn btn-block btn-primary'>
        Apoyar
      </Link>
    </div>
  </div>
)
