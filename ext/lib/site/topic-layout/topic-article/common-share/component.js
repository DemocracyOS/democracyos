import React from 'react'
import { SharerFacebook } from 'ext/lib/site/sharer'

export default function CommonShare ({ topic, type }) {
  let msj = ''
  let title = ''
  const topicUrl = `${window.location.origin}${topic.url}`
  switch (type) {
    case 'desafios':
      msj = `Mirá el Desafío en el que estoy participando ${topicUrl}`
      title = 'Compartí con tus vecinos este Desafío'
      break
    case 'consultas':
      msj = `Mirá la Consulta en la estoy participando ${topicUrl}`
      title = 'Compartí con tus vecinos esta Consulta'
      break
    case 'ideas':
      msj = `Mirá la Idea que estoy impulsando ${topicUrl}`
      title = 'Compartí con tus vecinos esta Idea'
      break
    case 'voluntariado':
      msj = `Mirá la Organización que estoy apoyando ${topicUrl}`
      title = 'Compartí con tus vecinos esta Organización'
      break
  }
  const twDesc = encodeURIComponent(msj)
  return (
    <div className='common-share'>
      <span>{title}</span>
      <div className='social-links'>
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
