import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import config from 'lib/config/config'
import user from 'lib/user/user'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import Sidebar from './sidebar/component'
import TopicArticle from './topic-article/component'

export default class TopicLayout extends Component {
  constructor (props) {
    super(props)

    this.state = {
      privileges: null,
      visibility: null,
      topics: null,
      forumName: null
    }
  }

  componentDidMount () {
    if (config.visibility === 'hidden' && !user.logged()) {
      return browserHistory.push('/signin')
    }
  }

  componentWillMount () {
    if (config.visibility === 'hidden' && !user.logged()) {
      browserHistory.push('/signin')
    }

    const forumName = this.props.params.forumName

    forumStore.findOneByName(forumName)
      .catch(err => {
        if (err.status === 404) window.location = '/404'
      })
      .then(forum => {
        if (!forum) return

        topicStore
          .findAll({forum: forum.id})
          .catch(console.error.bind(console))
          .then((topics) => {
            if (!topics || !topics.length) {
              this.setState({forumName})
              return
            }

            this.setState({
              topics,
              forumName,
              visibility: forum.visibility,
              privileges: forum.privileges
            })
          })
      })
  }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar
          className='nav-proposal'
          topics={this.state.topics} />
        <TopicArticle
          topicId={this.props.params.topicId}
          privileges={this.state.privileges}
          visibility={this.state.visibility}
          forumName={this.state.forumName} />
      </div>
    )
  }
}
