import React from 'react'
import padStart from 'string.prototype.padstart'
import { Link } from 'react-router'
import { SharerFacebook } from 'ext/lib/site/sharer'
import distritosData from '../distritos.json'

const distritos = (function () {
  const c = {}
  distritosData.forEach((d) => { c[d.name] = d.title })
  return c
})()

export default ({ topic, forum }) => {
  const topicUrl = `${window.location.origin}${topic.url}`

  let state
  if (topic.attrs && topic.attrs.state) {
    state = forum.topicsAttrs
      .find((attr) => attr.name === 'state')
      .options
      .find((attr) => attr.name === topic.attrs.state)
      .title
  }

  const twitterDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)

  const classNames = ['ext-topic-card', 'presupuesto-topic-card']

  if (topic.extra && typeof topic.extra.votes === 'number') {
    classNames.push('has-votes')
  }

  if (topic.attrs && topic.attrs.winner) classNames.push('is-winner')

  return (
    <div className={classNames.join(' ')}>
      {topic.attrs && topic.attrs.state && (
        <div className='state'>{state}</div>
      )}
      {topic.coverUrl && (
        <Link
          to={topic.url}
          className='topic-card-cover'
          style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      )}
      {topic.extra && typeof topic.extra.votes === 'number' && (
        <div className='topic-results'>
          <h2>{prettyDecimals(topic.extra.votes)} Votos</h2>
          <p>
            Proyecto {topic.attrs && topic.attrs.winner ? 'ganador' : 'presentado'}
          </p>
        </div>
      )}
      <div className='topic-card-info'>
        <div className='topic-location'>
          <i className='icon-location-pin' />
          <span>{topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? `Área Barrial ${topic.attrs.area}` : `Distrito ${distritos[topic.attrs.district]}`}</span>
          {topic.attrs && topic.attrs.number && (
            <span className='number'>
              <i className='icon-tag' />
              {prettyNumber(topic.attrs.number)}
            </span>
          )}
        </div>
        <h1 className='topic-card-title'>
          <Link to={topic.url}>{topic.mediaTitle}</Link>
        </h1>
        {topic.attrs && topic.attrs.description && (
          <p className='topic-card-description'>
            <Link to={topic.url}>{topic.attrs.description}</Link>
          </p>
        )}
        <div className='topic-card-footer'>
          <div className='social-links'>
            <SharerFacebook
              className='fb'
              params={{ picture: topic.coverUrl, link: topicUrl }} />
            <span
              onClick={handleLinkClick}
              target='_blank'
              href={`http://twitter.com/home?status=${twitterDesc}`}>
              <i className='icon-social-twitter' />
            </span>
            {window.innerWidth <= 630 &&
              <span
                onClick={handleLinkClick}
                href={`whatsapp://send?text=${twitterDesc}`}
                className='wp' />
            }
          </div>
          {topic.attrs && topic.attrs.budget && (
            <p className='budget'>{prettyPrice(topic.attrs.budget)}</p>
          )}
        </div>
      </div>
    </div>
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
  if (number.length <= 3) return number

  number = number.split('').reverse().join('').match(/[0-9]{1,3}/g)

  return (number || [])
    .join('.')
    .split('')
    .reverse()
    .join('')
}

function handleLinkClick (evt) {
  const link = evt.currentTarget
  evt.preventDefault()
  window.open(link.getAttribute('href'), '_blank')
}
