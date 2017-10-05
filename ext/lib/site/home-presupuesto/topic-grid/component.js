import React, { Component } from 'react'
import TopicCard from '../topic-card/component'

export default class TopicGrid extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    if (!this.props.districts && !this.props.districts.length) return null
    let districts = this.props.districts.filter(d => d.topics.length > 0)
    return (
      <div className='topics-grid'>
        {
          districts.map((district, i) =>
            <div key={i} className='topics-section'>
              <h2 className='topics-section-container topics-section-title'>
                Distrito {district.title}
              </h2>
              <div className='topics-container'>
                {this.props.loading && <div className='loader' />}
                {district.topics.map((topic, i) => <TopicCard key={i} topic={topic} />)}
              </div>
            </div>
          )
        }
        <div className='grid-bottom'>
          {
             districts.length > 0 && !this.props.noMore && <button className='ver-mas' onClick={this.props.paginateFoward}>Ver mas</button>
          }
          {
            districts.length == 0 && <p className='error-message'>No hay proyectos que coincidan con los filtros seleccionados.</p>
          }
        </div>
      </div>
    )
  }
}
