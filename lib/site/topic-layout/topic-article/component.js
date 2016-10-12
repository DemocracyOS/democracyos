import React, {Component} from 'react'
import bus from 'bus'
import t from 't-component'
import user from 'lib/user/user'
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
      showSidebar: false
    }
  }

  componentWillMount () {
    bus.on('sidebar:show', this.toggleSidebar)
  }

  componentWillUnmount () {
    bus.off('sidebar:show', this.toggleSidebar)
  }

  toggleSidebar = (bool) => {
    this.setState({
      showSidebar: bool
    })
  }

  handleCreateTopic = () => {
    window.location = urlBuilder.for('admin.topics.create', {
      forum: this.props.forum.name
    })
  }

  render () {
    const topic = this.props.topic
    const forum = this.props.forum
    const canCreateTopics = user.privileges &&
      user.privileges.canManage &&
      forum.privileges &&
      forum.privileges &&
      forum.privileges.canChangeTopics

    if (!topic) {
      return (
        <div className='no-topics'>
          <p>{t('homepage.no-topics')}</p>
          {
            canCreateTopics && (
              <button
                className='btn btn-primary'
                onClick={this.handleCreateTopic} >
                {t('homepage.create-debate')}
              </button>
            )
          }
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
        {topic.clauses && <Content clauses={topic.clauses} />}
        {topic.links && (
          <Footer
            source={topic.source}
            links={topic.links}
            socialUrl={topic.url}
            title={topic.mediaTitle} />
        )}
        {topic.clauses && topic.participants && (
          <Participants participants={topic.participants} />
        )}
        {
          topic.votable &&
            <DecisionMaker
              votes={votes}
              closed={topic.closed}
              id={topic.id}
              url={topic.url}
              closingAt={topic.closingAt}
              cantVote={!forum.privileges.canVoteAndComment} />
        }
      </div>
    )
  }
}

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
