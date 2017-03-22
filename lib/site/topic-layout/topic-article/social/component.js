import React, { Component } from 'react'
import t from 't-component'
import config from 'lib/config'

export default class Social extends Component {

  render () {
    let socialLinksUrl = window.location.origin + this.props.url
    let twitterText = config.tweetText || this.props.mediaTitle
    let count = this.props.participants.length
    let cardinality = count === 1 ? 'singular' : 'plural'
    let more = count > 5
    return (
      <div className='topic-article-content topic-social'>
        <div className='participants-box'>
        <div className='participants-container'>
        <span>
        {count + ' ' + t('proposal-article.participant.' + cardinality)}
        </span>
        {
          this.props.participants
          .map((participant, i) => {
            return (
              <a
              key={i}
              href='#'
              title={participant.displayName}
              className={i < 5 ? 'participant-profile' : 'hide'}>
              <img
              src={participant.avatar}
              className='avatar' />
              </a>
            )
          })
        }
        </div>
        <a href='#' className={more ? 'view-more hellip' : 'hide'}>&hellip;</a>
        </div>
        <div className='share-links'>
          <a
            href={'http://www.facebook.com/sharer.php?u=' + socialLinksUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flaticon social facebook' />
          <a
            href={'http://twitter.com/share?text=' + twitterText + '&url=' + socialLinksUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flaticon social twitter' />
        </div>
      </div>
    )
  }
}
