import React, {Component} from 'react'
import ProposalArticle from '../proposal-article/component'
import Sidebar from '../sidebar/component'
import forumStore from '../../stores/forum-store/forum-store'
import topicStore from '../../stores/topic-store/topic-store'

export default class Topic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topics : [
        {
          tag: {
            color: '',
            image: 'internet',
            name: ''
          },
          mediaTitle: '',
          title: '',
          clauses: [],
          votable: true,
          url: ''
        }
      ]
    }
  }

  componentDidMount() {
    this.state = forumStore
      .findOneByName(this.props.params.forumName)
      .then((forum) => {
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((topics) => {
        return {topics}
      })
      .catch(function (err) {
        console.error(err)
        debugger
      })
  }

  render () {
    return (
      <div>
        <Sidebar className='nav-proposal' />
        <ProposalArticle proposal={this.state.topics[0]} />
      </div>
    )
  }
}
