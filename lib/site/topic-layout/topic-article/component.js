import React, {Component} from 'react'
import bus from 'bus'
import topicStore from 'lib/stores/topic-store/topic-store'
import Header from './header/component'
import Content from './content/component'
import Footer from './footer/component'
import Participants from './participants/component'
import DecisionMaker from './decision-maker/component'

export default class TopicArticle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topic: null,
      showSidebar: null
    }
    this.getTopic = this.getTopic.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  componentWillMount () {
    bus.on('show-sidebar', this.toggleSidebar)
  }

  componentWillUnmount () {
    bus.off('show-sidebar', this.toggleSidebar)
  }

  toggleSidebar (bool) {
    this.setState({
      showSidebar: bool
    })
  }

  componentWillReceiveProps (props) {
    this.getTopic(props.topicId)
  }

  getTopic (topicId) {
    topicStore.clear()
    topicStore
      .findOne(topicId)
      .then((topic) => {
        if (topic) this.setState({topic})
      })
      .catch(err => {
        console.warn(err)
      })
  }

  render () {
    const topic = this.state.topic
    const privileges = this.props.privileges || {}

    if (!topic) return null

    const votes = {
      positive: topic.upvotes || [],
      negative: topic.downvotes || [],
      neutral: topic.abstentions || []
    }

    return (
      <div className='topic-article-wrapper'>
        {
          this.state.showSidebar &&
            <div onClick={hideSidebar} className='topic-overlay' />
        }
        <Header
          closingAt={topic.closingAt}
          closed={topic.closed}
          author={topic.author}
          authorUrl={topic.authorUrl}
          tag={topic.tag}
          mediaTitle={topic.mediaTitle} />
        <Content clauses={topic.clauses} />
        <Footer
          source={topic.source}
          links={topic.links}
          socialUrl={topic.url}
          title={topic.mediaTitle} />
        <Participants participants={topic.participants} />
        {
          topic.votable &&
            <DecisionMaker
              votes={votes}
              closed={topic.closed}
              id={topic.id}
              url={topic.url}
              closingAt={topic.closingAt}
              resetTopic={this.getTopic}
              cantVote={privileges.canVoteAndComment === false} />
        }
      </div>
    )
  }
}

function hideSidebar () {
  bus.emit('show-sidebar', false)
}
