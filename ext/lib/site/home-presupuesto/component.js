import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import user from 'lib/site/user/user'
import userConnector from 'lib/site/connectors/user'
import TopicCard from './topic-card/component'
import VotingModule from './voting-module/component'

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
      distrito: distritos[0].name,
      forum: null,
      topics: null
    }
  }

  componentWillMount () {
    this.fetchTopics()
  }

  fetchTopics = () => {
    this.setState({
      loading: true
    })

    forumStore
      .findOneByName('presupuesto')
      .then((forum) => {
        return topicStore.findAll({forum: forum.id})
          .then((topics) => {
            this.setState({
              loading: false,
              forum,
              topics
            })
          })
      }).catch((err) => {
        console.error(err)
        this.setState({
          loading: false,
          forum: null,
          topics: null
        })
      })
  }

  handleDistritoFilterChange = (distrito) => {
    this.setState({distrito}, this.fetchTopics)
  }

  render () {
    return (
      <div className='ext-home-presupuesto'>
        <div className='cover'>
          <div className='container'>
            {this.props.user.state.fulfilled && <VotingModule />}
            <h1>Votá los proyectos<br/>que querés para tu barrio</h1>
            <label>Elegí tu distrito para ver los proyectos</label>
            <DistritoFilter
              active={this.state.distrito}
              onChange={this.handleDistritoFilterChange} />
          </div>
        </div>
        {this.state.topics && (
          <div className='topics-container'>
            {this.state.loading && <div className='loader'></div>}
            {this.state.topics.map((topic) => {
              return <TopicCard key={topic.id} topic={topic} />
            })}
          </div>
        )}
      </div>
    )
  }
}

export default userConnector(HomePresupuesto)

function DistritoFilter (props) {
  const {active, onChange} = props

  function handleFilterChange (evt) {
    onChange(evt.target.getAttribute('data-name'))
  }

  return (
    <div className='distrito-filter'>
      {distritos.map((d) => {
        const isActive = d.name === active ? ' active' : ''
        return (
          <button
            type='button'
            key={d.name}
            data-name={d.name}
            onClick={handleFilterChange}
            className={`btn btn-lg btn-outline-primary${isActive}`}>
            {d.title}
          </button>
        )
      })}
    </div>
  )
}
