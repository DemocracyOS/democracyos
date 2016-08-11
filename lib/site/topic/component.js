import React, {Component} from 'react'
import ProposalArticle from '../proposal-article/component'
import Sidebar from '../sidebar/component'
import forumStore from '../../stores/forum-store/forum-store'
import topicStore from '../../stores/topic-store/topic-store'

export default class Topic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topic: null
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
        debugger
        topics[0].clauses = []
        console.log('setting topic state', topics[0])
        this.setState({topic: topics[0]})
      })
      .catch(function (err) {
        console.error('forum topics stores fail in Topic', err)
      })
  }

  render () {
    return (
      <div id='topic_wrapper'>
        <Sidebar className='nav-proposal' />
        {this.state.topic ? <ProposalArticle proposal={this.state.topic} /> : null}
      </div>
    )
  }
}
