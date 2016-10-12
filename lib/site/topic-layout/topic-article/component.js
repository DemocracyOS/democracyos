import React, {Component} from 'react'
import bus from 'bus'
import t from 't-component'
import user from 'lib/user/user'
import topicStore from 'lib/stores/topic-store/topic-store'
import urlBuilder from 'lib/url-builder'
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
      showSidebar: null,
      loading: null
    }
  }

  componentWillMount () {
    this.setState({loading: true})
    bus.on('sidebar:show', this.toggleSidebar)
    bus.on('topic-store:update', this.updateTopic)
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
    bus.off('topic-store:update', this.updateTopic)
    user.off('loaded', this.onUserStateChange)
    user.off('unloaded', this.onUserStateChange)
  }

  onUserStateChange = () => {
    this.forceUpdate()
  }

  toggleSidebar = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  componentWillReceiveProps (props) {
    this.getTopic(props.topicId)
  }

  getTopic = (topicId) => {
    if (!topicId) {
      this.setState({loading: false})
      return
    }

    this.setState({loading: true})

    topicStore.unset(topicId)

    topicStore
      .findOne(topicId)
      .catch(console.error.bind(console))
      .then((topic) => {
        this.setState({topic, loading: false})
      })
  }

  updateTopic = (newTopic) => {
    if (!this.state.topic) return
    if (this.state.topic.id === newTopic.id) {
      this.setState({topic: newTopic})
    }
  }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {forum: this.props.forumName})
  }

  render () {
    if (this.state.loading) return <Loader />

    const topic = this.state.topic

    if (!topic) {
      let createTopic = null

      if (user.privileges && user.privileges.canManage) {
        createTopic = (
          <button
            className='btn btn-primary'
            onClick={this.handleCreateTopic} >
            {t('homepage.create-debate')}
          </button>
        )
      }

      return (
        <div className='no-topics'>
          <p>{t('homepage.no-topics')}</p>
          {createTopic}
        </div>
      )
    }

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
              cantVote={
                !this.props.privileges.canVoteAndComment &&
                this.props.visibility === 'closed'
              } />
        }
      </div>
    )
  }
}

function hideSidebar () {
  bus.emit('sidebar:show', false)
}

function Loader () {
  return (
    <div className='loader-wrapper'>
      <div className='topic-loader' />
    </div>
  )
}
