import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import config from 'lib/config'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import topicConnector from 'lib/site/connectors/topic'
import Sidebar from './sidebar/component'
import TopicArticle from './topic-article/component'

export class TopicLayout extends Component {
  state = {
    topics: null,
    forum: null
  }

  componentDidMount () {
    let name = this.props.params.forum

    if (!name && !config.multiForum) {
      name = config.defaultForum
    }

    forumStore.findOneByName(name)
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, [ topics, pagination ]]) => {
        this.setState({
          forum,
          topics
        })
      })
      .catch((err) => {
        if (err.status === 404) {
          window.location = '/404'
          return
        }

        throw err
      })
  }

  render () {
    if (config.visibility === 'hidden' && this.props.user.state.rejected) {
      browserHistory.push('/signin')
      return null
    }

    const { topic } = this.props
    const { forum, topics } = this.state

    return (
      <div id='topic-wrapper'>
        <Sidebar topics={topics} />
        {forum && topic && (
          <TopicArticle topic={topic} forum={forum} />
        )}
      </div>
    )
  }
}

export default userConnector(topicConnector(TopicLayout))
