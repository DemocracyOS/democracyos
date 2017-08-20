import React from 'react'
import { Link } from 'react-router'
import t from 't-component'
import topicStore from 'lib/stores/topic-store/topic-store'

export default ({ topic }) => (
  <Link
    to={topic.url}
    className='topic-card'>
    <div
      className='topic-cover'
      style={{
        backgroundImage: `url("${topicStore.getCoverUrl(topic)}")`
      }} />
    <h3 className='title'>
      {topic.mediaTitle}
    </h3>
    <p className='participants'>
      <span>
        {topic.action.count}
      </span>
      &nbsp;
      {t('proposal-article.participant.plural')}
    </p>
  </Link>
)
