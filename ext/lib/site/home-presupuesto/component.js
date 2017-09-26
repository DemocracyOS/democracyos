import React, { Component } from 'react'
import forumStore from 'lib/stores/forum-store/forum-store'
import topicStore from 'lib/stores/topic-store/topic-store'
import userConnector from 'lib/site/connectors/user'
import Footer from '../footer/component'
import Cover from '../cover'
import TopicCard from './topic-card/component'
import FiltersNavbar from './filters-navbar/component'
import distritos from './distritos.json'

class HomePresupuesto extends Component {
  constructor (props) {
    super(props)
    }

  updateFilters(filters) {
    console.log('filters: ', filters)
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
            stage ='votacion-abierta'
            updateFilters = {this.updateFilters} />
        </div>
      </div>
    )
  }
}

export default userConnector(HomePresupuesto)