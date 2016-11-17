import React from 'react'
import padStart from 'string.prototype.padstart'
import {Link} from 'react-router'

export default function TopicCard (props) {
  const {topic} = props

  const topicUrl = `${location.origin}${topic.url}`

  return (
    <Link className='topic-card' to={topic.url}>
      {topic.extra && topic.extra.number && (
        <div className='number'>{prettyNumber(topic.extra.number)}</div>
      )}
      <div
        className='topic-card-cover'
        style={{backgroundImage: `url(${topic.coverUrl})`}} />
      <div className='topic-info'>
        <h1 className='title'>{topic.mediaTitle}</h1>
        {topic.extra && topic.extra.description && (
          <p className='description'>{topic.extra.description}</p>
        )}
        <div className='topic-card-footer'>
          <div className='social-links'>
            <span
              onClick={handleLinkClick}
              target='_blank'
              href={`http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(topicUrl)}`}>
              <i className='icon-social-facebook' />
            </span>
            <span
              onClick={handleLinkClick}
              target='_blank'
              href={`http://twitter.com/home?status=Quiero este proyecto para mi barrio #YoVotoPorMiBarrio @RParticipa ${topicUrl}`}>
              <i className='icon-social-twitter' />
            </span>
          </div>
          {topic.extra && topic.extra.budget && (
            <p className='budget'>{prettyPrice(topic.extra.budget)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function prettyNumber (number) {
  return `#${padStart(number, 3, '0')}`
}

function prettyPrice (number) {
  return `$${prettyDecimals(number)}`
}

function prettyDecimals (number) {
  if (typeof number === 'number') number = String(number)
  if (typeof number !== 'string') return ''

  number = number.split('').reverse().join('').match(/[0-9]{1,3}/g)

  return (number || [])
    .join('.')
    .split('')
    .reverse()
    .join('')
}

function handleLinkClick (evt) {
  const link = evt.currentTarget
  evt.preventDefault()
  window.open(link.getAttribute('href'), '_blank');
}
