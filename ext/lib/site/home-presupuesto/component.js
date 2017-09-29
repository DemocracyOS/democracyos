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
      s: 0,
      loading: true,
      stage: 'seguimiento',
      topics: null,
      edad: ['joven', 'adulto'],
      distrito: ['centro', 'noroeste', 'norte', 'oeste', 'sudoeste', 'sur'],
      anio: ['2016', '2017'],
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

    forumStore.findOneByName('presupuesto')
    .then((forum) => {
      this.setState({stage: forum.extra.stage})
      return this.fetchTopics(0)
    })
    .then((topics) => {
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

  fetchTopics (s) {
    const { edad, distrito, anio, estado } = this.state
    return window.fetch(`/ext/api/pp-feed`, {
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ edad, distrito, anio, estado, s })
      })
      .then((res) => res.json())
      .then((res) => {
        return Promise.resolve(res.result)
      })
  }

  paginateFoward = () => {
    this.setState({ loading: true }, () => {
      let s = this.state.s
      s += 20
      this.fetchTopics(s)
        .then((topics) => {
          this.setState({
            loading: false,
            topics: this.state.topics.concat(topics),
            s
          })
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            loading: false
          })
        })
    })
  }

  prepareTopics = () => {
    return distritos
      .filter(this.filtroDistritoCategoria)
      .map((distrito) => {
        distrito.topics = this.state.topics
          ? this.state.topics
              .filter(this.filtroEdad)
              .filter(this.filtroEstado)
              .filter(this.filtroAnio)
              .filter(this.filtroDistrito(distrito.name))
              .sort(byState)
              .sort(byEdad)
          : []

      return distrito
    })
  }

  prepareFilters = (filtros) =>  {
    const edad = Object.keys(filtros.edad).filter(k => filtros.edad[k])
    const distritos = Object.keys(filtros.distrito).filter(k => filtros.distrito[k])
    const anios = Object.keys(filtros.anio)
      .filter(k =>  filtros.anio[k])
      .map(anio => {
        if (anio === 'proyectos2016') {
          return '2016'
        }
        if (anio === 'proyectos2017') {
          return '2017'
        }
      })

    const estado = Object.keys(filtros.estado).filter(k => filtros.estado[k])
    this.setState ({
      edad: edad,
      distrito: distritos,
      anio: anios,
      estado: estado,
      s: 0
    }, this.fetchTopics)
  }

  //Filter Functions

  filtroEdad = (topic) => {
    return topic.attrs && topic.attrs.edad && this.state.edad.includes(topic.attrs.edad)
  }

  filtroEstado = (topic) => {
    return topic.attrs && topic.attrs.state && this.state.estado.includes(topic.attrs.state)
  }

  filtroDistritoCategoria = (distrito) => {
    return this.state.distrito.includes(distrito.name)
  }

  filtroAnio = (topic) => {
    return topic.attrs && topic.attrs.anio && this.state.anio.includes(topic.attrs.anio)
  }

  filtroDistrito = (distritoName) => (topic) => {
    return topic.attrs && topic.attrs.district === distritoName
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
            updateFilters={this.prepareFilters} />
        </div>
        <TopicGrid
          loading={this.state.loading}
          districts={this.prepareTopics()}
          paginateFoward={this.paginateFoward} />
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

function byEdad (a, b) {
  return a.attrs.edad === 'joven' ? 1 : -1
}
