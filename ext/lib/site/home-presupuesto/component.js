import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'
import VotingModule from '../voting-module/component'
import TopicCard from './topic-card/component'

const distritos = [
  {title: 'Centro', name: 'centro'},
  {title: 'Norte', name: 'norte'},
  {title: 'Noroeste', name: 'noroeste'},
  {title: 'Oeste', name: 'oeste'},
  {title: 'Sudoeste', name: 'sudoeste'},
  {title: 'Sur', name: 'sur'}
]

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      distrito: distritos[0],
      forum: null,
      topicsAreas: null,
      topicsDistrito: null
    }
  }

  componentWillMount () {
    this.fetchTopics()
  }

  fetchTopics = () => {
    this.setState({loading: true})

    forumStore
      .findOneByName('presupuesto')
      .then((forum) => {
        return topicStore.findAll({forum: forum.id})
          .then((topics) => {
            this.setState({
              loading: false,
              forum,
              topicsAreas: topics.filter((t) => {
                if (!t.extra) return false
                return t.extra.distrito === this.state.distrito.name &&
                  t.extra.area !== '0'
              }),
              topicsDistrito: topics.filter((t) => {
                if (!t.extra) return false
                return t.extra.distrito === this.state.distrito.name &&
                  (!t.extra.area || t.extra.area === '0')
              })
            })
          })
      }).catch((err) => {
        console.error(err)
        this.setState({
          loading: false,
          forum: null,
          topicsAreas: null,
          topicsDistrito: null
        })
      })
  }

  handleDistritoFilterChange = (distrito) => {
    this.setState({distrito}, this.fetchTopics)
  }

  render () {
    return (
      <div className='ext-home-presupuesto'>
        <VotingModule />
        <div className='cover'>
          <div className='container'>
            <h1>Votá los proyectos<br/>que querés para tu barrio</h1>
            <label>Elegí tu distrito para ver los proyectos</label>
            <DistritoFilter
              active={this.state.distrito}
              onChange={this.handleDistritoFilterChange} />
          </div>
        </div>
        {this.state.topicsAreas && this.state.topicsAreas.length > 0 && (
          <div className='topics-section areas'>
            <h2 className='topics-section-container'>
              Distrito {this.state.distrito.title} | Proyectos para tu barrio
            </h2>
            <div className='topics-container areas'>
              {this.state.loading && <div className='loader'></div>}
              {this.state.topicsAreas.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} />
              })}
            </div>
          </div>
        )}
        {this.state.topicsDistrito && this.state.topicsDistrito.length > 0 && (
          <div className='topics-section distrito'>
            <h2 className='topics-section-container'>
              Distrito {this.state.distrito.title} | Proyectos para tu distrito
            </h2>
            <div className='topics-container'>
              {this.state.loading && <div className='loader'></div>}
              {this.state.topicsDistrito.map((topic) => {
                return <TopicCard key={topic.id} topic={topic} />
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default userConnector(HomePresupuesto)

function DistritoFilter (props) {
  const {active, onChange} = props

  return (
    <div className='distrito-filter'>
      {distritos.map((d) => {
        const isActive = d.name === active.name ? ' active' : ''
        return (
          <button
            type='button'
            key={d.name}
            data-name={d.name}
            onClick={onChange.bind(null, d)}
            className={`btn btn-lg btn-outline-primary${isActive}`}>
            {d.title}
          </button>
        )
      })}
    </div>
  )
}
