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

  const socialLinksUrl = 'hola'
  const twitterText = 'chau'

  console.log('hola mundo')
  console.log(topic.attrs.state)

  return (
    <div className='presupuesto-container'>
      {
        state === 'Pendiente' && (
        <aside className='presupuesto-share ṕendiente'>
          {
            (topic.attrs && topic.attrs.budget) &&
              <div className='sharer-pending'>
                <div className='pending-header'>
                  <span className='presupuesto'>Presupuesto:</span>
                  {topic.attrs.number && <span className='numero-proyecto'>{`${prettyNumber(topic.attrs.number)}`}</span>}
                </div>
                <div className='pending-body'>
                  {topic.attrs.budget && <span className='presu-proyecto'>{prettyPrice(topic.attrs.budget)}</span>}
                  <button className='btn btn-active btn-pending'>Votar este proyecto</button>
                </div>
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
          </div>
        </aside>
        )
      }
      {
        state === 'Proyectado' &&
        (
        <aside className='presupuesto-share ganador'>
          <div className='box-header'>
            <span>Proyecto ganador</span>
          </div>
          <div className='box-content'>
            <div className='box-content-item'>
              <span className='box-content-title'>Presupuesto asignado:</span>
              <span className='box-content-info'>{prettyPrice(topic.attrs.budget)}</span>
            </div>
            <div className='box-content-item'>
              <span className='box-content-title'>Cantidad de votos:</span>
              <span className='box-content-info'>{topic.attrs.votes}</span>
            </div>
          </div>
          <div className='box-footer'>
            <span className='hashtag'>#ForosVecinalesVteLopez</span>
              <a target='_blank' href={`http://www.facebook.com/sharer.php?u=${socialLinksUrl}`} rel='noopener noreferrer' className='fb'></a>
              <a target='_blank' href={`http://twitter.com/share?text=${twitterText}&url=${socialLinksUrl}`} rel='noopener noreferrer' className='tw'></a>
          </div>
        </aside>
        )
      }
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