import React, { Component } from 'react'
import bus from 'bus'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicCard from './topic-card/component'

const filters = {
  new: {
    text: 'Más Nuevos',
    filter: (topic) => topic.status === 'open' && !topic.voted,
    emptyMsg: '¡Ya participaste en todos los desafíos!'
  },
  all: {
    text: 'Todos',
    filter: () => true,
    emptyMsg: 'No se encontraron desafíos.'
  },
  open: {
    text: 'Abiertos',
    filter: (topic) => topic.status === 'open',
    emptyMsg: 'Ya finalizaron todas los desafíos, te vamos a avisar cuando se publiquen nuevos.'
  },
  closed: {
    text: 'Finalizados',
    filter: (topic) => topic.status === 'closed',
    emptyMsg: 'No se encontraron desafíos finalizados.'
  }
}

function filter (key, items = []) {
  return items.filter(filters[key].filter)
}

class HomeDesafios extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null,
      filter: 'open',
      sort: 'pop'
    }
  }

  componentDidMount = () => {
    forumStore.findOneByName('desafios')
      .then((forum) => Promise.all([
        forum,
        topicStore.findAll({ forum: forum.id })
      ]))
      .then(([forum, topics]) => {
        let filterKey = this.state.filter
        let filtered = filter(filterKey, topics)

        if (filterKey === 'new' && filtered.length === 0) {
          filterKey = 'all'
          filtered = filter(filterKey, topics)
        }

        this.setState({
          forum,
          filter: filterKey,
          topics: filtered
        })

        Promise.all(filtered.map(this.getTopicCount))
          .then((topics) => { this.setState({ topics }) })
          .catch((err) => { console.log(err) })

        bus.on('topic-store:update:all', this.fetchTopics)
      })
      .catch((err) => { throw err })
  }

  getTopicCount (t) {
    t.count = 0
    const clauses = t.clauses.map((c) => c.markup).join(' ')
    let hrefs = []
    if (clauses) {
      const regex = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*))/gi
      let m

      while ((m = regex.exec(clauses)) !== null) {
          if (m.index === regex.lastIndex) {
              regex.lastIndex++
          }

          m.forEach((match, groupIndex) => {
            if (match && groupIndex === 1) hrefs.push(match)
          })
      }

      const formUrl = hrefs[hrefs.length - 1] + '/total_registros'
      return window.fetch(formUrl).then((r) => r.json()).then((r) => {
        t.count = r.registros
        return t
      })
    } else {
      return Promise.resolve(t)
    }
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
        Promise.all(filter(key, topics).map(this.getTopicCount))
          .then((topics) => { this.setState({ topics, filter: key }) })
          .catch((err) => { console.log(err) })
        // this.setState({
        //   filter: key,
        //   topics: filter(key, topics)
        // })
      })
      .catch((err) => { throw err })
  }

  render () {
    const { forum, topics } = this.state

    return (
      <div className='ext-home-desafios'>
        <Cover
          logo='/ext/lib/site/home-multiforum/desafios-icono.png'
          title='Desafíos'
          description='Tenemos desafíos como comunidad y podemos resolverlos juntos.' />
        <Filter
          onChange={this.handleFilterChange}
          active={this.state.filter} />
        {topics && topics.length > 0 && (
          <div className='topics-section'>
            <div className='topics-container'>
              {topics.map((topic) => {
                return <TopicCard key={topic.id} forum={forum} topic={topic} />
              })}
            </div>
          </div>
        )}
        {topics && <Footer />}
      </div>
    )
  }
}

const Filter = ({ onChange, active }) => (
  <div className='container'>
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
  </div>
)

export default userConnector(HomeDesafios)
