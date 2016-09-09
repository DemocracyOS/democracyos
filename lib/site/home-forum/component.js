import React, {Component} from 'react'
import config from 'lib/config/config'
import Sidebar from '../sidebar/component'
import TopicArticle from 'lib/site/topic-article/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class HomeForum extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      topic: null,
      privileges: null
    }
  }

  componentDidMount () {
    let privileges = null
    let forumName = this.props.params.forumName || config.defaultForum
    forumStore
      .findOneByName(forumName)
      .then(function (forum) {
        privileges = forum.privileges
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((topics) => {
        if (!topics || !topics.length) return null
        this.setState({topics, topicID: topics[0].id, privileges})
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

