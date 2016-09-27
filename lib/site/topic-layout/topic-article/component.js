import React, {Component} from 'react'
import bus from 'bus'
import t from 't-component'
import user from 'lib/user/user'
import topicStore from 'lib/stores/topic-store/topic-store'
import urlBuilder from 'lib/url-builder/url-builder'
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
    this.getTopic = this.getTopic.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.onUserStateChange = this.onUserStateChange.bind(this)
    this.createTopicLink = this.createTopicLink.bind(this)
  }

  componentWillMount () {
    this.setState({loading: true})
    bus.on('show-sidebar', this.toggleSidebar)
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  componentWillUnmount () {
    bus.off('show-sidebar', this.toggleSidebar)
    user.on('loaded', this.onUserStateChange)
    user.on('unloaded', this.onUserStateChange)
  }

  onUserStateChange () {
    this.forceUpdate()
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
    if (!topicId) return
    this.setState({loading: true})
    topicStore.clear()
    topicStore
      .findOne(topicId)
      .catch(err => { console.warn(err) })
      .then((topic) => {
        this.setState({topic, loading: false})
      })
  }

  createTopicLink () {
    window.location = urlBuilder.admin({name: this.props.forumName}) + '/topics/create'
  }

  render () {
    if (this.state.loading) {
      return <span>loading</span>
    }
    const topic = this.state.topic
    if (!topic) {
      let createTopic = null
      if (user.privileges && user.privileges.canManage) {
        createTopic = (
          <button
            className='btn btn-primary'
            onClick={this.createTopicLink}>
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
              resetTopic={this.getTopic}
              cantVote={
                this.props.privileges.canVoteAndComment === false ||
                this.props.visibility === 'closed'
              } />
        }
      </div>
    )
  }
}

function hideSidebar () {
  bus.emit('show-sidebar', false)
}
