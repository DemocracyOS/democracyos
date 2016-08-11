import React, {Component} from 'react'
import ProposalArticle from '../proposal-article/component'
import Sidebar from '../sidebar/component'
import forumStore from '../../stores/forum-store/forum-store'
import topicStore from '../../stores/topic-store/topic-store'

export default class Topic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topic: {
        id: "",
        topicId: "sara",
        title: "Title",
        mediaTitle: "Media Title",
        status: "open",
        open: true,
        clauses: [],
        closed: false,
        draft: false,
        deleted: false,
        forum: "",
        tag: {
          _id: "",
          name: "",
          hash: "",
          image: "police",
          color: "#091A33",
          id: ""
        },
        participants: [],
        voted: false,
        createdAt: "",
        updatedAt: "",
        closingAt: null,
        publishedAt: "",
        links: [],
        author: "Author",
        authorUrl: "",
        url: ""
      }
    }
  }

  componentDidMount() {
    forumStore
      .findOneByName(this.props.params.forumName)
      .then(function (forum) {
        return topicStore
          .findAll({forum: forum.id})
      })
      .then((topics) => {
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
        <ProposalArticle proposal={this.state.topic} />
      </div>
    )
  }
}
