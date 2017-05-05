import React from 'react'
import { Link } from 'react-router'

export default ({ topic }) => (
  <div className='ext-topic-card desafios-topic-card'>
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
      <div className='topic-card-footer-container'>
        <div className='topic-card-footer'>
          <div className='comments'>
            <Link to={topic.url}>
              <span>
                {topic.comments ? topic.comments.length : 0}
              </span>
              {' '}
              <span>Comentarios</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
)
