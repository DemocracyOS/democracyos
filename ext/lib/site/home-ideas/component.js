import React, { Component } from 'react'
import bus from 'bus'
import t from 't-component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
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
          <div className='topics-section'>
            <div className='topics-container'>
              {topics.map((topic) => {
                return <TopicCard key={topic.id} forum={forum} topic={topic} />
              })}
            </div>
          </div>
        )}
        <Footer />
      </div>
    )
  }
}

export default userConnector(HomeIdeas)
