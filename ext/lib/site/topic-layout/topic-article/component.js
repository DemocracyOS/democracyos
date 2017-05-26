import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Content from 'ext/lib/site/topic-layout/topic-article/content/component'
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
      window.fetch(`/ext/api/ideas/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            this.setState({ closedSuccess: true })
          }
        })
    }
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
                  {topic.privileges.canEdit && (
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
                  {forum.privileges.canChangeTopics && (
                    <button
                      onClick={this.handleCloseTopic(topic.id)}
                      className='btn btn-danger btn-sm eliminar-idea'
                      disabled={(topic.status === 'closed' || this.state.closedSuccess)}>
                      {
                        (topic.status === 'closed' || this.state.closedSuccess)
                          ? 'Cerrado'
                          : 'Cerrar'
                      }
                    </button>
                  )}
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-12'>
                  {topic.clauses && <Content clauses={topic.clauses} />}

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

                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              {
                forum.name === 'presupuesto'
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
        {topic.attrs && topic.attrs.description && (
          <p>{topic.attrs.description}</p>
        )}
      </div>
    </div>
  </header>
)
