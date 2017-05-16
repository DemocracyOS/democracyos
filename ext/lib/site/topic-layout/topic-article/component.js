import React, { Component } from 'react'
import { Link } from 'react-router'
import bus from 'bus'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Content from 'ext/lib/site/topic-layout/topic-article/content/component'
import Comments from 'lib/site/topic-layout/topic-article/comments/component'
import Vote from 'lib/site/topic-layout/topic-article/vote/component'
import Poll from 'lib/site/topic-layout/topic-article/poll/component'
import Cause from 'lib/site/topic-layout/topic-article/cause/component'
import PresupuestoShare from './presupuesto-share/component'
import CommonShare from './common-share/component'

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
    const { topic, forum, user } = this.props
    console.log(topic, forum)
    return (
      <div className='proyecto-container'>
        {this.state.showSidebar && (
          <div onClick={hideSidebar} className='topic-overlay' />
        )}
        <Header topic={topic} />
        <div className='proyecto-main container'>
          <div className='row'>
            <div className='proyecto-content col-md-8'>
              <div className='row'>
                <div className='col-12'>
                  <Link className='volver' to={forum.url}>
                    <i className='icon-arrow-left' />&nbsp;Volver a {forum.title}
                  </Link>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
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
            <div className='col-md-4'>
              {
                forum.name === 'presupuesto'
                  ? <PresupuestoShare
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
