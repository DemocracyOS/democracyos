import React, {Component} from 'react'
import config from 'lib/config/config'
import user from 'lib/user/user'
import Sidebar from './sidebar/component'
import TopicArticle from './topic-article/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class TopicLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      privileges: null,
      visibility: null,
      topics: null,
      topicId: null,
      forumName: null
    }
  }

  componentWillMount () {
    if (config.visibility === 'hidden' && !user.logged()) {
      browserHistory.push('/signin')
    }
    let forumName = config.multiForum
      ? this.props.params.forumName
      : config.defaultForum

    forumStore
      .findOneByName(forumName)
      .catch(err => {
        if (err.status === 404) window.location = '/404'
      })
      .then(forum => {
        if (!forum) return
        topicStore
          .findAll({forum: forum.id})
          .catch(err => { console.warn(err) })
          .then((topics) => {
            if (!topics || !topics.length) return null
            this.setState({
              topics,
              topicId: this.props.params.topicId,
              forumName,
              visibility: forum.visibility,
              privileges: forum.privileges
            })
          })
      })
  }

  // componentWillReceiveProps (props) {
  //   let forumName = this.props.params.forumName || config.defaultForum
  //   this.getTopics(forumName)
  //   this.setState({topicId: props.params.topicId})
  // }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar
          className='nav-proposal'
          topics={this.state.topics} />
        <TopicArticle
          topicId={this.state.topicId}
          privileges={this.state.privileges}
          visibility={this.state.visibility}
          forumName={this.state.forumName} />
      </div>
    )
  }
}
