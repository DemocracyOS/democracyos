import React, {Component} from 'react'
import Sidebar from '../sidebar/component'
import TopicArticle from '../topic-article/component'
import forumStore from '../../stores/forum-store/forum-store'
import topicStore from '../../stores/topic-store/topic-store'

export default class ForumHome extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      topic: null
    }
  }

  componentDidMount () {
    let topics = null
    forumStore
      .findOneByName(this.props.params.forumName)
      .then(function (forum) {
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((_topics) => {
        if(!_topics || !_topics.length) return null
        topics = _topics
        return topicStore
          .findOne(topics[0].id)
      })
      .then((topic) => {
        this.setState({topics, topic})
      })
  }

  render () {
    return (
      <div id='topic_wrapper'>
        <Sidebar className='nav-proposal' topics={this.state.topics} />
        <TopicArticle topic={this.state.topic} />
      </div>
    )
  }
}

