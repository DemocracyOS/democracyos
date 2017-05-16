import React from 'react'
import { Link } from 'react-router'

export default ({ topic, onVote }) => (
  <div className='ext-topic-card ideas-topic-card'>
    {/*
    {topic.coverUrl && (
      <Link
        to={topic.url}
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
    )}
    */}
    <div className='topic-card-info'>
      <h1 className='topic-card-title'>
        <Link to={topic.url}>
          {topic.mediaTitle}
          <button className='btn btn-link btn-sm'>Más info</button>
        </Link>
      </h1>
      {topic.tags && topic.tags.length > 0 && (
        <div className='topic-card-tags'>
          {topic.tags.slice(0, 12).map((tag) => (
            <span key={tag} className='badge badge-default'>{tag}</span>
          ))}
        </div>
      )}
    </div>
    <div className='topic-card-footer'>
      <div className='participants'>
        <span className='icon-heart' />
        &nbsp;
        {topic.participants.length}
      </div>
      {topic.currentUser.action.supported && (
        <button disabled className='btn btn-block btn-primary'>
          ¡Gracias!
        </button>
      )}
      {!topic.currentUser.action.supported && (
        <button
          onClick={() => onVote(topic.id)}
          className='btn btn-block btn-primary'>
          Apoyar
        </button>
      )}
    </div>
  </div>
)
