import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

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
      <div className='topic-creation'>
        <i className='icon-user' />
        <span>{topic.owner.fullName}</span>
        <span className='date'>
          {moment(topic.createdAt).format('D/M/YY')}
        </span>
      </div>
      <h1 className='topic-card-title'>
        <Link to={topic.url}>
          {topic.mediaTitle}
        </Link>
        <p className='topic-card-description'>
          <Link to={topic.url}>{createClauses(topic.clauses)}</Link>
        </p>
      </h1>
      {
        topic.tags && topic.tags.length > 0 && (
          <div className='topic-card-tags'>
            {topic.tags.slice(0, 12).map((tag) => (
              <span key={tag} className='badge badge-default'>{tag}</span>
            ))}
          </div>
        )
      }
    </div>
    <div className='topic-card-footer'>
      <div className='participants'>
        <span className='icon-heart' />
        {
          // !topic.currentUser.action.supported
          //   ? <span onClick={() => onVote(topic.id)} className='icon-heart' />
          //   : <span className='icon-heart' />
        }
        &nbsp;
        {topic.participants.length}
      </div>
      {topic.currentUser.action.supported && (
        <button disabled className='btn btn-primary'>
          ¡Gracias!
        </button>
      )}
      {!topic.currentUser.action.supported && (
        <button
          onClick={() => onVote(topic.id)}
          className='btn btn-primary'>
          Apoyar
        </button>
      )}
    </div>
  </div>
)

function createClauses (clauses) {
  let div = document.createElement('div')
  const content = clauses
    .sort(function (a, b) {
      return a.position > b.position ? 1 : -1
    })
    .map(function (clause) {
      return clause.markup
    })
    .join('')
  div.innerHTML = content
  return div.textContent.replace(/\r?\n|\r/g, '').slice(0, 140) + '...'
}
