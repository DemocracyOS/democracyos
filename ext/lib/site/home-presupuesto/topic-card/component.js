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

export default ({ topic }) => {
  const topicUrl = `${window.location.origin}${topic.url}`

  let state
  const estadosPP = [
      {
          "name" : "proyectado",
          "title" : "Proyectado"
      },
      {
          "name" : "ejecutandose",
          "title" : "En Ejecución"
      },
      {
          "name" : "terminado",
          "title" : "Terminado"
      }
  ]

  if (topic.attrs && topic.attrs.state && estadosPP.map(e => e.name).includes(topic.attrs.state)) {
    state = estadosPP.find((attr) => attr.name === topic.attrs.state).title
  }

  const twitterDesc = encodeURIComponent(`Mirá el proyecto para mi barrio ${topicUrl} #RosarioParticipa`)

  const classNames = ['ext-topic-card', 'presupuesto-topic-card']

  if (topic.extra && typeof topic.extra.votes === 'number') {
    classNames.push('has-votes')
  }

  if (topic.attrs && topic.attrs.state) classNames.push(topic.attrs.state.toLowerCase())
  if (topic.attrs.edad === 'joven') classNames.push('topic-joven')
  if (topic.attrs.area !== '0' && topic.attrs.edad !== 'joven') classNames.push('topic-area')
  if (topic.attrs.area === '0' && topic.attrs.edad !== 'joven') classNames.push('topic-distrito')

  return (
    <div className={classNames.join(' ')}>
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
        {topic.attrs && topic.attrs.state && estadosPP.map(e => e.name).includes(topic.attrs.state) && (
          <div className='state'>{state}</div>
        )}
        <div className='topic-location'>
          <span>{topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? `Área Barrial ${topic.attrs.area}` : `Distrito ${distritos[topic.attrs.district]}`}</span>
          {topic.attrs && topic.attrs.number && (
            <span className='number'>
              {topic.attrs.anio}
            </span>
          )}
        </div>
        <div className='topic-card-body'>
          <h1 className='topic-card-title'>
            <Link to={topic.url}>{topic.mediaTitle}</Link>
          </h1>
          {topic.attrs && topic.attrs.description && (
            <p className='topic-card-description'>
              <Link to={topic.url}>{topic.attrs.description}</Link>
            </p>
          )}
        </div>
        <div className='topic-card-footer'>
          <div className='topic-card-category'>
            <span>
              {topic.attrs.edad === 'joven' ? `Joven` : topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? `Área Barrial` : `Distrito` }
            </span>
          </div>
          {topic.attrs && (
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
  if (!number) number = 1
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
