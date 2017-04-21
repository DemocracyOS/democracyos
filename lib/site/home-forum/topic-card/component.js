import React from 'react'
import { Link } from 'react-router'
import t from 't-component'

export default ({ topic }) => (
  <Link
    to={topic.url}
    className='topic-card'>
    <div
      className='topic-cover'
      style={{
        backgroundImage: `url("${topic.coverUrl}")`
      }} />
    <h3 className='title'>
      {topic.mediaTitle}
    </h3>
    <p className='participants'>
      <span>
        {topic.participants.length}
      </span>
      &nbsp;
      {t('proposal-article.participant.plural')}
    </p>
  </Link>
)
