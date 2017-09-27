import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicCard from './topic-card/component'
import TopicGrid from './topic-grid/component'
import FiltersNavbar from './filters-navbar/component'
import BannerPresupuesto from './banner-presupuesto/component'
import distritos from './distritos.json'

let distritoCurrent = ''

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      topics: null,
      edad: ['joven', 'adulto'],
      distrito: ['centro', 'noroeste', 'norte', 'oeste', 'sudoeste', 'sur'],
      anio: ['2015', '2016', '2017'],
      estado: ['proyectado', 'ejecutandose', 'finalizado']   
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
    return distritos
      .filter(this.filtroDistrito)
      .map((distrito) => {
        distrito.topics = this.state.topics ?
          this.state.topics
            .filter(this.filtroEdad)
            .filter(this.filtroEstado)
            .filter(this.filtroAnio)
            .filter((topic) => {
              return topic.attrs && topic.attrs.district === distrito.name
            }) : []
        console.log(distrito.topics)
      return distrito
    })
  }

  prepareFilters = (filtros) =>  {
    const edad = Object.keys(filtros.edad).filter(k => filtros.edad[k])
    const distritos = Object.keys(filtros.distrito).filter(k => filtros.distrito[k])
    const anios = Object.keys(filtros.anio)
      .filter(k =>  filtros.anio[k])
      .map(anio => {
        if (anio === 'proyectos2015') {
        anio = '2015' 
        return anio
      }
      if (anio === 'proyectos2016') {
        anio = '2016' 
        return anio
      }
      if (anio === 'proyectos2017') {
        anio = '2017' 
        return anio
      }
      })

    const estado = Object.keys(filtros.estado).filter(k => filtros.estado[k])
    console.log(distritos)
    this.setState ({
      edad: edad,
      distrito: distritos,
      anio: anios,
      estado: estado
    })
    console.log(this.state)
  }

  getFilters = (filters) => {
    console.log(filters.distrito)
    this.prepareFilters(filters)
  }


  //Filter Functions

  filtroEdad = (topic) => {
    return topic.edad && this.state.edad.includes(topic.edad)
  }

  filtroEstado = (topic) => {
    return topic.attrs && topic.attrs.state && this.state.estado.includes(topic.attrs.state) 
  }

  filtroDistrito = (distrito) => {
    return this.state.distrito.includes(distrito.name)
  }

  filtroAnio = (topic) => {
    return topic.attrs && topic.attrs.anio && this.state.anio.includes(topic.attrs.anio)
  }
  
  render () {
    return (
      <div className='ext-home-presupuesto'>
        <Cover
          background='/ext/lib/site/boot/presupuesto-participativo.jpg'
          logo='/ext/lib/site/home-multiforum/presupuesto-icono.png'
          title='Presupuesto Participativo'
          description='Vos decidís cómo invertir parte del presupuesto de la ciudad. Podés elegir los proyectos que van a cambiar tu barrio y seguir su ejecución.' />
        <div className='topics-section-container filters-wrapper'>
          <FiltersNavbar
            stage ='seguimiento'
            updateFilters = {this.getFilters} />
        </div>
        <TopicGrid
          loading={this.state.loading}
          districts={this.prepareTopics()} />
        {this.state.topics &&
          <BannerPresupuesto content='votacion'/> 
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
