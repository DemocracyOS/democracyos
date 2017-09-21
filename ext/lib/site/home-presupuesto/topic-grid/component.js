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
                            <h2 className='topics-section-container topics-section-title topic-title-distrito'> 
                                    {district.title} 
                            </h2>
                            <div className='topics-container'>
                                {this.props.loading && <div className='loader' />}
                                {district.topics.map((topic)=> {
                                    if (topic.edad !== 'joven' && topic.attrs.area === '0'){
                                    return <TopicCard key={topic.id} topic={topic} />}
                                })}
                            </div>
                            <h2 className='topics-section-container topics-section-title topic-title-area'> 
                                    Area Barrial
                            </h2>
                            <div className='topics-container'>
                                {district.topics.map((topic)=> {
                                    if (topic.edad !== 'joven' && topic.attrs.area !== '0'){
                                    return <TopicCard key={topic.id} topic={topic} />}
                                })}
                            </div>
                            <h2 className='topics-section-container topics-section-title topic-title-joven'> 
                                    Jóvenes
                            </h2>
                            <div className='topics-container'>
                                {district.topics.map((topic)=> {
                                    if (topic.edad === 'joven'){
                                    return <TopicCard key={topic.id} topic={topic} />}
                                })}
                            </div>
                        </div>
                    )
                )} 
            </div>
        )}
    }
