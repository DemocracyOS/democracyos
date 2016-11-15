import React, {Component} from 'react'
import {Link} from 'react-router'
import bus from 'bus'
import t from 't-component'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Content from 'ext/lib/site/topic-layout/topic-article/content/component'
import Comments from 'lib/site/topic-layout/topic-article/comments/component'

class TopicArticle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false
    }
  }

  componentWillMount () {
    bus.on('sidebar:show', this.toggleSidebar)
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
  }

  toggleSidebar = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.props.forum.name
    })
  }

  render () {
    const {
      topic,
      forum,
      user
    } = this.props

    const userAttrs = user.state.fulfilled && (user.state.value || {})
    const canCreateTopics = userAttrs.privileges &&
      userAttrs.privileges.canManage &&
      forum &&
      forum.privileges &&
      forum.privileges.canChangeTopics

    const votes = {
      positive: topic.upvotes || [],
      negative: topic.downvotes || [],
      neutral: topic.abstentions || []
    }

    return (
      <div className='proyecto-container'>
        {
          this.state.showSidebar &&
            <div onClick={hideSidebar} className='topic-overlay' />
        }
        <header className='proyecto-container-header'>
          <div className='header-content'>
            <h1>{topic.mediaTitle}</h1>
            Autor: {topic.author}
          </div>
        </header>
        <div className='proyecto-main container'>
          <div className='row'>
            <div className='proyecto-content col-md-8'>
              <Link className='volver' to='presupuesto'>&lt; Ver todos los proyectos</Link>
              {
                topic.clauses && <Content clauses={topic.clauses} />
              }
              <p className='preguntas'>¿Qué te parece este proyecto?¿Deseás que sea parte de tu barrio?</p>
            </div>
            <div className='proyecto-share col-md-4'>
              <div>
                <span className='hashtag'>#YoVotoPorMiBarrio</span>
                <span>Compartí con tus vecinos<br />este proyecto</span>
                <div className='social-links'>
                  <a href='#' className='fb'></a>
                  <a href='#' className='tw'></a>
                  <a href='#' className='msj'></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          !user.state.pending && <Comments forum={forum} topic={topic} />
        }
      </div>
    )
  }
}

export default userConnector(TopicArticle)

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
