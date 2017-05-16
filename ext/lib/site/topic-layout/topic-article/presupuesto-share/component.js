import React from 'react'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default function PresupuestoShare ({ topic }) {
  const topicUrl = `${window.location.origin}${topic.url}`
  const twDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)
  return (
    <div className='presupuesto-share'>
      <div className='sharer-header'>
        <span className='numero-proyecto'>{`# ${topic.attrs.number}`}</span>
        <span className='votos-proyecto'>{`${topic.attrs.votes} VOTOS`}</span>
        {
          topic.attrs.winner &&
          <span className='winner-proyecto'>PROYECTO GANADOR</span>
        }
      </div>
      <div className='sharer-body'>
        <span className='state-proyecto'>{`Estado: ${topic.attrs.state}`}</span>
        <span className='presu-proyecto'>{`Presupuesto: ${topic.attrs.budget}`}</span>
      </div>
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
    </div>
  )
}
