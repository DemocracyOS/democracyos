import React, {Component} from 'react'
import Sidebar from '../sidebar/component'
import TopicArticle from 'lib/site/topic-article/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class HomeSingleForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      topic: null,
      privileges: null
    }
  }

  componentDidMount () {
    let topics = null
    let privileges = null
    forumStore
      .findOneByName(this.props.params.forumName)
      .then(function (forum) {
        privileges = forum.privileges
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((_topics) => {
        if (!_topics || !_topics.length) return null
        topics = _topics
        return topicStore
          .findOne(topics[0].id)
      })
      .then((topic) => {
        this.setState({topics, topic, privileges})
      })
  }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar className='nav-proposal' topics={this.state.topics} />
        <TopicArticle topic={this.state.topic} privileges={this.state.privileges} />
      </div>
    )
  }
}

