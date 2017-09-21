import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicCard from './topic-card/component'
import TopicGrid from './topic-grid/component'
import BannerPresupuesto from './banner-presupuesto/component'
import distritos from './distritos.json'

let distritoCurrent = ''

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true,
      topics: null
    }
  }

  componentDidMount () {
    this.setState({ loading: true }, this.fetchForums)
  }

  _fetchingForums = false
  fetchForums = () => {
    if (this._fetchingForums) return
    this._fetchingForums = true
    this.setState({ loading: true })

    Promise.all([
      forumStore.findOneByName('presupuesto'),
      forumStore.findOneByName('presupuesto-joven')
    ])
    .then(([forum, forumJoven]) => Promise.all([
        topicStore.findAll({ forum: forum.id }),
        topicStore.findAll({ forum: forumJoven.id })
      ])
    )
    .then(([topicsAdulto, topicsJoven]) => {
      const topics = [].concat(
        topicsAdulto.map((topic) => {
          topic.edad = 'adulto'
          return topic
        })
      ).concat(
        topicsJoven.map((topic) => {
          topic.edad = 'joven'
          return topic
        })
      )
      this._fetchingForums = false
      this.setState({
        loading: false,
        topics
      })
    })
    .catch((err) => {
      this._fetchingForums = false
      console.error(err)
      this.setState({
        loading: false,
        topics: null
      })
    })
  }

  prepareTopics = () => {
    return distritos.map((distrito) => {
      distrito.topics = this.state.topics ?
        this.state.topics.filter((topic) => {
          return topic.attrs && topic.attrs.district === distrito.name
        }) : []
      return distrito
    })
  }

  render () {
    return (
      <div className='ext-home-presupuesto'>
        <Cover
          background='/ext/lib/site/boot/presupuesto-participativo.jpg'
          logo='/ext/lib/site/home-multiforum/presupuesto-icono.png'
          title='Presupuesto Participativo'
          description='Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a cambiar tu barrio y seguir su ejecución.' />
        <TopicGrid
          loading={this.state.loading}
          districts={this.prepareTopics()} />
        {this.state.topics &&
          <BannerPresupuesto content='archivo'/> 
        }
        {this.state.topics && 
          <Footer />
        }
      </div>
    )
  }
}

export default userConnector(HomePresupuesto)

function sortTopics (topics) {
  return topics
    .filter(winners)
    .sort(byNumber)
    .sort(byState)
}

function winners (topic) {
  return topic.attrs && topic.attrs.winner
}

function byNumber (a, b) {
  if (!(a.attrs && a.attrs.number)) return -1
  if (!(b.attrs && b.attrs.number)) return 1
  return a.attrs.number > b.attrs.number
    ? 1
    : a.attrs.number < b.attrs.number
    ? -1
    : 0
}

function estadoNum (e) {
  switch (e) {
    case 'terminado':
      return 1
    case 'ejecutandose':
      return 2
    case 'proyectado':
      return 3
    default:
      return 4
  }
}

function byState (a, b) {
  let ae = estadoNum(a.attrs && a.attrs.state)
  let be = estadoNum(b.attrs && b.attrs.state)
  return ae > be
    ? 1
    : ae < be
    ? -1
    : 0
}
