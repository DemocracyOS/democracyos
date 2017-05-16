import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import bus from 'bus'
import t from 't-component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import tagsConnector from 'lib/site/connectors/tags'
import Cover from '../cover'
import Footer from '../footer/component'
import TopicCard from './topic-card/component'

class HomeIdeas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('ideas')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, topics]) => {
        this.setState({
          forum,
          topics
        })

        bus.on('topic-store:update:all', this.fetchTopics)
      })
      .catch((err) => { throw err })
  }

  componentWillUnmount = () => {
    bus.off('topic-store:update:all', this.fetchTopics)
  }

  fetchTopics = () => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then((topics) => {
        this.setState({ topics })
      })
      .catch((err) => { throw err })
  }

  handleFilterChange = (key) => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then((topics) => {
        this.setState({ topics })
      })
      .catch((err) => { throw err })
  }

  handleVote = (id) => {
    const { user } = this.props

    if (user.state.rejected) {
      return browserHistory.push({
        pathname: '/signin',
        query: { ref: window.location.pathname }
      })
    }

    topicStore.support(id)
      .catch((err) => { throw err })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-ideas'>
        <Cover
          background='/ext/lib/site/boot/bg-home-forum.jpg'
          logo='/ext/lib/site/home-multiforum/idea-icono.png'
          title='Ideas'
          description='Proponé y apoyá ideas.'>
          <a
            href='/ideas/admin/topics/create'
            className='btn btn-primary crear-idea'>
            {t('proposal-article.create')}
          </a>
        </Cover>
        {topics && topics.length > 0 && (
          <div className='container topics-container'>
            <div className='row'>
              <div className='col-md-8'>
                {topics.map((topic) => (
                  <TopicCard
                    onVote={this.handleVote}
                    key={topic.id}
                    forum={forum}
                    topic={topic} />
                ))}
              </div>
              <div className='col-md-4'>
                <TagsList forum={forum} />
              </div>
            </div>
          </div>
        )}
        {topics && <Footer />}
      </div>
    )
  }
}

const TagsList = tagsConnector(({ tags }) => {
  if (!tags) return null
  if (tags && tags.length > 50) tags = tags.slice(0, 50)

  return tags && tags.length > 0 && (
    <div className='topic-card-tags'>
      {tags.map((tag) => (
        <span className='badge badge-default'>{tag}</span>
      ))}
    </div>
  )
})

export default userConnector(HomeIdeas)
