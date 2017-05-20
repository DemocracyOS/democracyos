import React, { PureComponent } from 'react'
import t from 't-component'
import config from 'lib/config'

export default ({ topic }) => {
  const { url, mediaTitle, participants } = topic

  const socialLinksUrl = window.location.origin + url
  const twitterText = encodeURIComponent(
    config.tweetText ? t(config.tweetText, { topic }) : mediaTitle
  )

  return (
    <div className='topic-article-content topic-social'>
      <Participants participants={participants} />
      <div className='share-links'>
        <a
          href={`http://www.facebook.com/sharer.php?u=${socialLinksUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className='icon-social-facebook' />
        <a
          href={`http://twitter.com/share?text=${twitterText}&url=${socialLinksUrl}`}
          target='_blank'
          rel='noopener noreferrer'
          className='icon-social-twitter' />
      </div>
    </div>
  )
}

class Participants extends PureComponent {
  constructor (props) {
    super(props)

    const participants = props.participants
    const count = participants.length
    const cardinality = count === 1 ? 'singular' : 'plural'

    this.state = {
      countMsg: `${count} ${t(`proposal-article.participant.${cardinality}`)}`,
      showAll: false,
      moreToShow: count > 5,
      participants: participants.splice(0, 5)
    }
  }

  handleShowAll = () => {
    this.setState({ showAll: true })
  }

  render () {
    const { countMsg, participants, showAll, moreToShow } = this.state

    const participantsToShow = showAll ? this.props.participants : participants

    return (
      <div className='participants-box'>
        <span>{countMsg}</span>
        {participantsToShow.map((participant, i) => (
          <span
            key={i}
            title={participant.displayName}
            className='participant-profile'>
            <img src={participant.avatar} className='avatar' />
          </span>
        ))}
        {moreToShow && !showAll && (
          <a
            className='view-more hellip'
            onClick={this.handleShowAll}>&hellip;</a>
        )}
      </div>
    )
  }
}
