import React from 'react'
import padStart from 'string.prototype.padstart'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default function PresupuestoShare ({ topic, forum }) {
  const topicUrl = `${window.location.origin}${topic.url}`
  const twDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)
  let state
  if (topic.attrs && topic.attrs.state) {
    state = forum.topicsAttrs
      .find((attr) => attr.name === 'state')
      .options
      .find((attr) => attr.name === topic.attrs.state)
      .title
  }
  const stateTitle = forum.topicsAttrs.find((ta) => ta.name === 'state').title
  const anioTitle = forum.topicsAttrs.find((ta) => ta.name === 'anio').title
  return (
    <div className='presupuesto-share'>
      {
        topic.attrs &&
          <div className='sharer-header'>
            {topic.attrs.number && <span className='numero-proyecto'>{`${prettyNumber(topic.attrs.number)}`}</span>}
            {topic.attrs.votes && <span className='votos-proyecto'>{`${prettyDecimals(topic.attrs.votes)} VOTOS`}</span>}
            <span className='winner-proyecto'>Proyecto {topic.attrs && topic.attrs.winner ? 'ganador' : 'presentado'}</span>
          </div>
      }
      {
        (topic.attrs.state || topic.attrs.budget) &&
          <div className='sharer-body'>
            {topic.attrs.anio && <span className='anio-proyecto'>{`${anioTitle}: ${topic.attrs.anio}`}</span>}
            {topic.attrs.state && <span className='state-proyecto'>{`${stateTitle}: ${state}`}</span>}
            {topic.attrs.budget && <span className='presu-proyecto'>{`Presupuesto: ${prettyPrice(topic.attrs.budget)}`}</span>}
          </div>
      }
      <div className='social-links'>
        <span className='hashtag'>#YoVotoPorMiBarrio</span>
        <SharerFacebook
          className='fb'
          params={{
            picture: topic.coverUrl,
            link: window.location.href
          }} />
        <a
          target='_blank'
          href={`http://twitter.com/home?status=${twDesc}`}
          className='tw' />
        {
          window.innerWidth <= 630 &&
          (
            <a
              target='_blank'
              href={`whatsapp://send?text=${twDesc}`}
              className='wp' />
          )
        }
      </div>
    </div>
  )
}

function prettyNumber (number) {
  if (!number) number = 1
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
