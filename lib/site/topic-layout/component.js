import React, {Component} from 'react'
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
      topic: null
    }
    this.getData = this.getData.bind(this)
  }

  componentDidMount () {
    this.getData(this.props.params.forumName, this.props.params.topicId)
  }

  componentWillReceiveProps (props) {
    this.getData(props.params.forumName, props.params.topicId)
  }

  getData (forumName, topicId) {
    Promise.all(
      [
        forumStore
          .findOneByName(forumName),
        forumStore
          .findOneByName(forumName)
          .then(function (forum) {
            return topicStore
              .findAll({forum: forum.id})
          }),
        topicStore
          .findOne(topicId)
      ]
    )
    .then((results) => {
      this.setState({
        privileges: results[0].privileges,
        topics: results[1],
        topic: results[2]
      })
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
