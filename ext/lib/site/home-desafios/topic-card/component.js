import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

export default ({ topic }) => (
  <div className='ext-topic-card desafios-topic-card'>
    {topic.coverUrl && (
      <Link
        to={topic.url}
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
    )}
    <div className='topic-card-info'>
      <div className='fecha'>{moment(topic.createdAt).format('D/M/YY')}</div>
      <h1 className='topic-card-title'>
        <Link to={topic.url}>{topic.mediaTitle}</Link>
      </h1>
    </div>
    <div className='topic-card-footer'>
      <div className='participants'>
        {` ${topic.participants.length} participante${topic.participants.length !== 1 ? 's' : ''}`}
      </div>
      <Link to={topic.url} className='btn btn-block btn-primary'>
        Quiero ser parte
      </Link>
    </div>
  </div>
)
