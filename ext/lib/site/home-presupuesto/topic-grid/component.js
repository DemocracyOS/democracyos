import React, { Component } from 'react'
import TopicCard from '../topic-card/component'

export default class TopicGrid extends Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div>
                {this.props.districts && this.props.districts.length > 0 && (
                    this.props.districts.map((district, i) => 
                        <div key={i} className='topics-section'>
                            <h2 className='topics-section-container topics-section-title'> 
                                Distrito {district.title} 
                            </h2>
                            <div className='topics-container'>
                                {this.props.loading && <div className='loader' />}
                                {district.topics.map((topic)=> 
                                     <TopicCard key={topic.id} topic={topic} />
                                )}
                            </div>
                        </div>
                    )
                )} 
            </div>
        )}
    }
