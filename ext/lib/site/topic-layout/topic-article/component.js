import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Content from 'ext/lib/site/topic-layout/topic-article/content/component'
import PopupCenter from 'ext/lib/open-popup'
import Comments from 'lib/site/topic-layout/topic-article/comments/component'
import Poll from 'lib/site/topic-layout/topic-article/poll/component'
import Cause from 'lib/site/topic-layout/topic-article/cause/component'
import PresupuestoShare from './presupuesto-share/component'
import CommonShare from './common-share/component'

class TopicArticle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      showSidebar: false,
      closedSuccess: false
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

  handleCloseTopic = (id) => {
    return () => {
      window.fetch(`/ext/api/ideas/${id}`, { method: 'DELETE', credentials: 'include' })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            this.setState({ closedSuccess: true })
          }
        })
    }
  }

  openPopup = (e) => {
    e.preventDefault()
    const { topic, user } = this.props
    let url = 'https://www.rosario.gov.ar/form/id/contacto_institucional_persona/53'
    if (user.state.value) {
      const userValue = user.state.value
      url += `?ong_nombre=${encodeURI(topic.mediaTitle)}&ong_id=${topic.id}&nombreirstName}&apellido=${userValue.lastName}&email=${userValue.email}&email_conf=${userValue.email}`
    }
    PopupCenter(url, topic.mediaTitle, 900, 500)
  }

  render () {
    const { topic, forum, user } = this.props
    return (
      <div className={`proyecto-container ${forum.name === 'ideas' ? 'idea-topic' : ''}`}>
        {this.state.showSidebar && (
          <div onClick={hideSidebar} className='topic-overlay' />
        )}
        <Header topic={topic} isIdea={forum.name === 'ideas'} />
        <div className='proyecto-main container'>
          <div className='row'>
            <div className='proyecto-content col-lg-8'>
              <div className='row'>
                <div className='col-lg-12'>
                  <Link className='volver' to={forum.url}>
                    <i className='icon-arrow-left' />&nbsp;Volver a {forum.title}
                  </Link>
                  {(topic.privileges.canEdit || forum.privileges.canChangeTopics) && (
                    <a
                      href={urlBuilder.for('admin.topics.id', {
                        forum: forum.name,
                        id: topic.id
                      })}
                      className='btn btn-default btn-sm editar-idea'>
                      <i className='icon-pencil' />
                      &nbsp;
                      Editar
                    </a>
                  )}
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-12'>
                  {
                    topic.clauses &&
                      <Content
                        clauses={topic.clauses}
                        user={user.state}
                        titulo={topic.mediaTitle}
                        id={topic._id}
                        esDesafio={(forum.name === 'desafios')} />
                  }

                  {
                    topic.action.method && topic.action.method === 'poll' && (
                      <Poll
                        topic={topic}
                        canVoteAndComment={forum.privileges.canVoteAndComment} />
                    )
                  }
                  {
                    topic.action.method && topic.action.method === 'cause' && (
                      <Cause
                        topic={topic}
                        canVoteAndComment={forum.privileges.canVoteAndComment} />
                    )
                  }
                  {
                    forum.name === 'voluntariado' && (
                      <a onClick={this.openPopup} className='btn btn-primary' href='#'>Contactáte</a>
                    )
                  }
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              {
                (forum.name === 'presupuesto' ||
                forum.name === 'presupuesto-joven')
                  ? <PresupuestoShare
                    forum={forum}
                    topic={topic} />
                  : <CommonShare
                    topic={topic}
                    type={forum.name} />
              }
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

const Header = ({ topic }) => (
  <header
    className={`proyecto-container-header ${!topic.coverUrl ? 'no-cover' : ''}`}
    style={topic.coverUrl ? {
      backgroundImage: `url(${topic.coverUrl})`
    } : null}>
    <div className='header-content'>
      <div className='container'>
        <h1>{topic.mediaTitle}</h1>
        <div className='autor'>
          <div
          className='avatar'
          style={{
            backgroundImage: `url(${topic.owner.avatar})`
          }}></div>
          <span>{topic.owner.fullName}</span>
        </div>
      </div>
    </div>
  </header>
)
