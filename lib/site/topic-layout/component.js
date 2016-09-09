import React, {Component} from 'react'
import config from 'lib/config/config'
import Sidebar from 'lib/site/sidebar/component'
import TopicArticle from 'lib/site/topic-article/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class TopicLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      privileges: null,
      topics: null,
      topicId: null
    }
    this.getTopics = this.getTopics.bind(this)
  }

  componentWillMount () {
    let forumName = this.props.params.forumName || config.defaultForum
    this.getTopics(forumName)
    this.setState({topicId: this.props.params.topicId})
  }

  componentWillReceiveProps (props) {
    let forumName = this.props.params.forumName || config.defaultForum
    this.getTopics(forumName)
    this.setState({topicId: props.params.topicId})
  }

  getTopics (forumName, topicId) {
    let privileges = null
    forumStore
      .findOneByName(forumName)
      .then(function (forum) {
        privileges = forum.privileges
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((topics) => {
        if (!topics || !topics.length) return null
        this.setState({topics, privileges})
      })
  }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar
          className='nav-proposal'
          topics={this.state.topics} />
        <TopicArticle
          topicId={this.state.topicId}
          privileges={this.state.privileges} />
      </div>
    )
  }
}
