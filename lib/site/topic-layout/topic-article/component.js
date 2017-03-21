import React, {Component} from 'react'
import bus from 'bus'
import t from 't-component'
import config from 'lib/config'
import urlBuilder from 'lib/url-builder'
import userConnector from 'lib/site/connectors/user'
import Header from './header/component'
import Content from './content/component'
import Footer from './footer/component'
import Participants from './participants/component'
import Vote from './vote/component'
import Poll from './poll/component'
import Comments from './comments/component'

class TopicArticle extends Component {
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
    const {
      topic,
      forum,
      user
    } = this.props

    const userAttrs = user.state.fulfilled && (user.state.value || {})
    const canCreateTopics = userAttrs.privileges &&
      userAttrs.privileges.canManage &&
      forum &&
      forum.privileges &&
      forum.privileges.canChangeTopics
    let socialLinksUrl = window.location.origin + topic.url
    let twitterText = config.tweetText || topic.mediaTitle

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
        {
          topic.links && (
            <Footer
              source={topic.source}
              links={topic.links}
              socialUrl={topic.url}
              title={topic.mediaTitle} />
          )
        }
        {
          topic.action.method && topic.action.method === 'vote' && (
            <Vote
              votes={{
                positive: topic.upvotes || [],
                negative: topic.downvotes || [],
                neutral: topic.abstentions || []
              }}
              closed={topic.closed}
              id={topic.id}
              url={topic.url}
              closingAt={topic.closingAt}
              canVoteAndComment={forum.privileges.canVoteAndComment} />
          )
        }
        {
          topic.action.method && topic.action.method === 'poll' && (
            <Poll
              polls={topic.action.pollResults}
              options={topic.action.pollOptions}
              closed={topic.closed}
              id={topic.id}
              url={topic.url}
              closingAt={topic.closingAt}
              canVoteAndComment={forum.privileges.canVoteAndComment} />
          )
        }
        {
          topic.clauses && topic.participants && (
            <Participants participants={topic.participants} />
          )
        }
        <div className='topic-article-content'>
          <div className='share-links'>
            <a
              href={'http://www.facebook.com/sharer.php?u=' + socialLinksUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flaticon social facebook' />
            <a
              href={'http://twitter.com/share?text=' + twitterText + '&url=' + socialLinksUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flaticon social twitter' />
            </div>
            {
              !user.state.pending && <Comments forum={forum} topic={topic} />
            }
          </div>
        </div>
    )
  }
}

export default userConnector(TopicArticle)

function hideSidebar () {
  bus.emit('sidebar:show', false)
}
