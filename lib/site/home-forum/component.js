import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import user from 'lib/user/user'
import config from 'lib/config/config'
import checkReservedNames from 'lib/forum/check-reserved-names'
import Sidebar from 'lib/site/topic-layout/sidebar/component'
import TopicArticle from 'lib/site/topic-layout/topic-article/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class HomeForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      topicId: null,
      privileges: null,
      visibility: null,
      forumName: null
    }
  }

  componentWillMount () {
    if (!config.multiForum && !config.defaultForum) {
      window.location = 'forums/new'
    }
    if (config.visibility === 'hidden' && !user.logged()) {
      browserHistory.push('/signin')
    }
    checkReservedNames(this.props.params.forumName)

    let forumName = config.multiForum
      ? this.props.params.forumName
      : config.defaultForum

    forumStore
      .findOneByName(forumName)
      .catch(err => {
        if (err.status === 404) browserHistory.push('/404')
        if (err.status === 401) browserHistory.push('/401')
      })
      .then(forum => {
        if (!forum) return
        topicStore
          .findAll({forum: forum.id})
          .catch(err => { console.warn(err) })
          .then(topics => {
            if (!topics || !topics.length) return
            this.setState({
              forumName,
              topics,
              topicId: topics[0].id,
              privileges: forum.privileges,
              visibility: forum.visibility
            })
          })
      })
  }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar
          className='nav-proposal'
          topics={this.state.topics}
          activeTopic={this.state.topicId} />
        <TopicArticle
          topicId={this.state.topicId}
          privileges={this.state.privileges}
          visibility={this.state.visibility}
          forumName={this.state.forumName} />
      </div>
    )
  }
}
