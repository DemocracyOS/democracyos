import React, { Component } from 'react'
import TopicCard from './topic-card/component'

export default class TopicGrid extends Component {
    constructor (props) {
        super(props)

    }
    componentDidMount () {
        console.log(this.props)
    }
    render () {
    return (
        <div>
            {this.props.topicsAreas && this.props.topicsAreas.length > 0 && (
                <div className='topics-section areas'>
                    <h2 className='topics-section-container topics-section-title'>
                    Distrito {this.props.distrito.title} | Proyectos para tu barrio
                    </h2>
                    <div className='topics-container areas'>
                        {this.props.loading && <div className='loader' />}
                        {this.props.topicsAreas.map((topic) => {
                            return <TopicCard key={topic.id} topic={topic} forum={this.props.forum} />
                        })}
                    </div>
                </div>
            )}
            {this.props.topicsDistrito && this.props.topicsDistrito.length > 0 && (
                <div className='topics-section distrito'>
                    <h2 className='topics-section-container topics-section-title'>
                        Distrito {this.props.distrito.title} | Proyectos para tu distrito
                    </h2>
                    <div className='topics-container'>
                        {this.props.loading && <div className='loader' />}
                        {this.props.topicsDistrito.map((topic) => {
                        return <TopicCard key={topic.id} topic={topic} forum={this.props.forum} />
                        })}
                    </div>
                </div>
            )}
            {this.props.topicsJoven && this.props.topicsJoven.length > 0 && (
                <div className='topics-section pp-joven'>
                    <h2 className='topics-section-container topics-section-title'>
                        <span>Distrito {this.props.distrito.title} | Proyectos jóvenes</span><br />
                        <sub />
                    </h2>
                    <div className='topics-container'>
                        {this.props.loading && <div className='loader' />}
                        {this.props.topicsJoven.map((topic) => {
                            return <TopicCard key={topic.id} topic={topic} forum={this.props.forumJoven} />
                        })}
                    </div>
                </div>
            )}
        </div>
    )}
}