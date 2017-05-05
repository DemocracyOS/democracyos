import React, { Component } from 'react'
import bus from 'bus'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import TopicCard from './topic-card/component'

const filters = {

  all: {
    text: 'Todas',
    filter: (topic) => topic
  },
  open: {
    text: 'Abiertas',
    filter: (topic) => topic.open
  },
  closed: {
    text: 'Cerradas',
    filter: (topic) => topic.closed
  }
}

function filter (key, items = []) {
  return items.filter(filters[key].filter)
}

class HomeConsultas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null,
      filter: 'all'
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('consultas')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, topics]) => {
        this.setState({
          forum,
          topics: filter(this.state.filter, topics)
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
        this.setState({
          topics: filter(this.state.filter, topics)
        })
      })
      .catch((err) => { throw err })
  }

  handleFilterChange = (key) => {
    topicStore.findAll({ forum: this.state.forum.id })
      .then((topics) => {
        this.setState({
          filter: key,
          topics: filter(key, topics)
        })
      })
      .catch((err) => { throw err })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-consultas'>
        <div className='cover'>
          <div className='container'>
            <div className='isologo consultas' />
            <h1>Consultas</h1>
            <p>La Municipalidad quiere conocer tu opinión sobre<br />diferentes temáticas de nuestra Ciudad.</p>
          </div>
        </div>
        <div className='container'>
          <Filter
            onChange={this.handleFilterChange}
            active={this.state.filter} />
        </div>
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

const Filter = ({ onChange, active }) => (
  <div className='topics-filter'>
    {Object.keys(filters).map((key) => (
      <button
        key={key}
        className={`btn btn-secondary btn-sm ${active === key ? 'active' : ''}`}
        onClick={() => onChange(key)}>
        {filters[key].text}
      </button>
    ))}
  </div>
)

export default userConnector(HomeConsultas)
