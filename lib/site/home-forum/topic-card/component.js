import React, {Component} from 'react'
import {Link} from 'react-router'
import Geopattern from 'geopattern'
import t from 't-component'

export default class TopicCard extends Component {
  render () {
    return (
      <Link
        to={this.props.topic.url}
        className='topic-card'>
        <div
          className='topic-cover'
          style={{
            backgroundImage: this.props.topic.coverUrl ? `url(${this.props.topic.coverUrl})` :
              Geopattern
                .generate(this.props.topic.id)
                .toDataUrl()
          }} />
        <h3 className='title'>
          {this.props.topic.mediaTitle}
        </h3>
        <p className='participants'>
          <span>
            {this.props.topic.participants.length}
          </span>
          &nbsp;
          {t('proposal-article.participant.plural')}
        </p>
      </Link>
    )
  }
}
