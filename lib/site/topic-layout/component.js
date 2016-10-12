import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import config from 'lib/config'
import user from 'lib/user/user'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import Sidebar from './sidebar/component'
import TopicArticle from './topic-article/component'

export default class TopicLayout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      topics: null,
      forum: null
    }
  }

  componentDidMount () {
    if (config.visibility === 'hidden' && !user.logged()) {
      return browserHistory.push('/signin')
    }

    const name = this.props.params.forum

    forumStore.findOneByName(name)
      .catch(err => {
        if (err.status === 404) window.location = '/404'
      })
      .then(forum => {
        if (!forum) return

        this.setState({forum})

        topicStore
          .findAll({forum: forum.id})
          .catch(console.error.bind(console))
          .then(topics => {
            this.setState({
              topics: topics || []
            })
          })
      })
  }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar topics={this.state.topics} />
        <TopicArticle
          topicId={this.props.params.topicId}
          privileges={this.state.forum && this.state.forum.privileges}
          visibility={this.state.forum && this.state.forum.visibility}
          forumName={this.props.params.forum} />
      </div>
    )
  }
}
