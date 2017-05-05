import React from 'react'
import { Link } from 'react-router'
import distritosData from 'ext/lib/site/home-presupuesto/distritos.json'

const distritos = (function () {
  const c = {}
  distritosData.forEach((d) => { c[d.name] = d.title })
  return c
})()

export default function TopicCard (props) {
  const { topic } = props

  const classNames = ['topic-card']

  return (
    <div className={classNames.join(' ')} >
      <div className='topic-tags'>
        <span className='primary-tag'>voluntariado</span>
        {
          topic.tags.length > 0 &&
          topic.tags.map((tag, i) => (<span key={i}>#{tag}</span>))
        }
        {
          topic.attrs &&
          topic.attrs.district &&
          (<span>#distrito{topic.attrs.district}</span>)
        }
      </div>
      <div
        className='topic-card-cover'
        style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      <div className='topic-info'>
        <div className='topic-location'>
          <i className='icon-location-pin' />
          <span>{topic.attrs && topic.attrs.area && topic.attrs.area !== '0' ? `Área Barrial ${topic.attrs.area}` : `Distrito ${distritos[topic.attrs.district]}`}</span>
        </div>
        <h1 className='title'>{topic.mediaTitle}</h1>
        {topic.attrs && topic.attrs.description && (
          <p className='description'>{topic.attrs.description}</p>
        )}
        <div className='topic-card-footer-container'>
          <div className='topic-card-footer'>
            <div className='comments'>
              <Link to={topic.url}>
                <span>Mas info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
