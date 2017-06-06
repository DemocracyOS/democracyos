import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import tagsConnector from 'lib/site/connectors/tags'
import Cover from '../cover'
import Footer from '../footer/component'
import TopicCard from './topic-card/component'

const filters = {
  new: {
    text: 'Más Nuevas',
    sort: '-createdAt',
    filter: (topic) => topic.status === 'open',
    emptyMsg: 'No se encontraron ideas.'
  },
  pop: {
    text: 'Más Populares',
    sort: '-participantsCount',
    filter: (topic) => topic.status === 'open',
    emptyMsg: 'No se encontraron ideas.'
  },
  closed: {
    text: 'Archivadas',
    sort: '-participantsCount',
    filter: (topic) => topic.status === 'closed',
    emptyMsg: 'No se encontraron ideas.'
  }
}

function filter (key, items = []) {
  return items.filter(filters[key].filter)
}

const ListTools = ({ onChangeFilter, activeFilter }) => (
  <div className='container'>
    <div className='row'>
      <div className='col-md-8 list-tools'>
        <div className='topics-filter'>
          {Object.keys(filters).map((key) => (
            <button
              key={key}
              className={`btn btn-secondary btn-sm ${activeFilter === key ? 'active' : ''}`}
              onClick={() => onChangeFilter(key)}>
              {filters[key].text}
            </button>
          ))}
        </div>
        <a
          href='/ideas/admin/topics/create'
          className='btn btn-lg btn-primary crear-idea'>
          Escribí tu idea
        </a>
      </div>
    </div>
  </div>
)

class HomeIdeas extends Component {
  constructor (props) {
    super(props)

    this.state = {
      forum: null,
      topics: null,
      tags: null,
      filter: 'pop'
    }
  }

  componentDidMount = () => {
    var u = new window.URLSearchParams(window.location.search)
    let query = {}

    forumStore.findOneByName('ideas')
      .then((forum) => {
        const tags = window.fetch(`/api/v2/forums/${forum.id}/tags`).then((res) => res.json())
        query.forum = forum.id
        query.sort = filters[this.state.filter].sort
        if (u.has('tag')) query.tag = u.get('tag')
        return Promise.all([
          forum,
          topicStore.findAll(query),
          tags
        ])
      })
      .then(([forum, topics, tags]) => {
        this.setState({
          forum,
          topics: filter(this.state.filter, topics),
          tags: tags.results.tags
        })
      })
      .catch((err) => { throw err })
  }

  handleFilterChange = (key) => {
    let query = {}
    var u = new window.URLSearchParams(window.location.search)
    if (u.has('tag')) query.tag = u.get('tag')
    query.forum = this.state.forum.id
    query.sort = filters[this.state.filter].sort

    topicStore.findAll(query)
      .then((topics) => {
        this.setState({
          filter: key,
          topics: filter(key, topics)
        })
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

    topicStore.support(id).then((res) => {
      let topics = this.state.topics
      let index = topics.findIndex((t) => t.id === id)
      topics[index] = res
      this.setState({ topics })
    }).catch((err) => { throw err })
  }

  render () {
    const { forum, topics, tags } = this.state

    return (
      <div className='ext-home-ideas'>
        <Cover
          background='/ext/lib/site/boot/ideas.jpg'
          logo='/ext/lib/site/home-multiforum/ideas-icono.png'
          title='Ideas'
          description='¿Tenés ideas para mejorar la vida en la ciudad? Compartilas.' />
        <ListTools
          activeFilter={this.state.filter}
          onChangeFilter={this.handleFilterChange} />
        <div className='container topics-container'>
          <div className='row'>
            <div className='col-md-4 push-md-8 etiquetas'>
              <h3>Distritos</h3>
              {forum && <TagsList tags={forum.initialTags} forumName={forum.name} />}
              <h3>Temas</h3>
              {forum && <TagsList tags={tags} forumName={forum.name} />}
            </div>
            <div className='col-md-8 pull-md-4'>

              {topics && topics.length === 0 && (
                <div className='empty-msg'>
                  <div className='alert alert-success' role='alert'>
                    {filters[this.state.filter].emptyMsg}
                  </div>
                </div>
              )}
              {topics && topics.map((topic) => (
                <TopicCard
                  onVote={this.handleVote}
                  key={topic.id}
                  forum={forum}
                  topic={topic} />
              ))}
            </div>
          </div>
        </div>
        {topics && <Footer />}
      </div>
    )
  }
}

const TagsList = tagsConnector(({ tags, forumName }) => {
  var u = new window.URLSearchParams(window.location.search)
  return tags && tags.length > 0 && (
    <div className='forum-tags'>
      {tags.map((tag, i) => (
        <a
          className={`badge badge-default ${(u.has('tag') && u.get('tag') === tag) ? 'active' : ''}`}
          href={`${window.location.origin}/${forumName}?tag=${tag}`}
          key={i}>
          {tag}
        </a>
      ))}
    </div>
  )
})

export default userConnector(HomeIdeas)
