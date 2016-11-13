import React from 'react'
import padStart from 'string.prototype.padstart'
import {Link} from 'react-router'

export default function TopicCard (props) {
  const {topic} = props

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
        {topic.extra && topic.extra.budget && (
          <p className='budget'>{prettyPrice(topic.extra.budget)}</p>
        )}
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
