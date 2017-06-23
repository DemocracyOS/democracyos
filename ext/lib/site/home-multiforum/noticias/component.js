import React, { Component } from 'react'
import Content from 'lib/site/topic-layout/topic-article/content/component'

class Noticias extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topic: null
    }
  }

  componentWillMount () {
    window.fetch(`/ext/api/noticias`)
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          this.setState({ topic: res.result.topic })
        }
      })
  }

  render () {
    const { topic } = this.state
    if (!topic) return null
    return (
      <div id='noticias' className='container'>
        <div className='texto-container'>
          <h3>{topic.mediaTitle}</h3>
          <Content clauses={topic.clauses} />
          {
            topic.attrs.linkText && (
              <a className='btn btn-primary' target='_blank' href={topic.attrs.linkUrl}>{topic.attrs.linkText}</a>
            )
          }
        </div>
        <div className='media-container'>
          {
            topic.attrs.videoUrl &&
            <iframe width='560' height='315' src={topic.attrs.videoUrl} frameBorder='0' allowFullScreen />
          }
          {
            !topic.attrs.videoUrl && topic.attrs.imgUrl &&
            <div className='media-img' style={{ backgroundImage: `url('${topic.attrs.imgUrl}')` }} />
          }
        </div>
      </div>
    )
  }
}

export default Noticias
