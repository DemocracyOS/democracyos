import React from 'react'
import { Link } from 'react-router'

export default ({ topic }) => (
  <div className='ext-topic-card voluntariado-topic-card'>
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
      {topic.tags && topic.tags.length > 0 && (
        <div className='topic-card-tags'>
          {topic.tags.slice(0, 12).map((tag) => (
            <span key={tag} className='badge badge-default'>{tag}</span>
          ))}
        </div>
      )}
      {/*
      {topic.attrs && topic.attrs.description && (
        <p className='topic-card-description'>
          <Link to={topic.url}>{topic.attrs.description}</Link>
        </p>
      )}
      */}
      <br />
      <Link to={topic.url} className='btn btn-block btn-primary'>
        Quiero participar
      </Link>
    </div>
  </div>
)
