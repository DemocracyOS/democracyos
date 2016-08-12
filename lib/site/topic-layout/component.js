import React, {Component} from 'react'
import Sidebar from 'lib/site/sidebar/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class TopicLayout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null
    }
  }

  componentDidMount () {
    debugger
    forumStore
      .findOneByName(this.props.params.forumName)
      .then(function (forum) {
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((topics) => {
        this.setState({topics})
      })
  }

  render () {
    return (
      <div id='topic_wrapper'>
        <Sidebar className='nav-proposal' topics={this.state.topics} />
        {this.props.children}
      </div>
    )
  }
}
