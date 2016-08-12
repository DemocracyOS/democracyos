import React, {Component} from 'react'
import Sidebar from '../sidebar/component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'

export default class Topic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics: null
    }
  }

  componentDidMount () {
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
