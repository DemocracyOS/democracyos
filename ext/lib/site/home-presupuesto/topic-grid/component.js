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
                {district.topics.map((topic)=>{
                     return <TopicCard key={topic.id} topic={topic} />
                }
                )}
              </div>
            </div>
          )
        }
        <div className='grid-bottom'>
          {
            !this.props.noMore && <button className='ver-mas' onClick={this.props.paginateFoward}>Ver mas</button>
          }
        </div>
      </div>
    )
  }
}
