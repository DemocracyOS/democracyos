import React, {Component} from 'react'
import Sidebar from 'lib/site/sidebar/component'
import TopicArticle from 'lib/site/topic-article/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class TopicLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null,
      topic: null
    }
  }

  componentDidMount () {
    Promise.all(
      [
        forumStore
          .findOneByName(this.props.params.forumName)
          .then(function (forum) {
            return topicStore
              .findAll({forum: forum.id})
          }),
        topicStore
          .findOne(this.props.params.topicId)
      ]
    )
    .then((results) => {
      this.setState({topics: results[0], topic: results[1]})
    })
  }

  render () {
    return (
      <div id='topic-wrapper'>
        <Sidebar className='nav-proposal' topics={this.state.topics} />
        <TopicArticle topic={this.state.topic} />
      </div>
    )
  }
}
