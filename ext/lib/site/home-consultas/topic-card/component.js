import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'
import Timeago from 'lib/site/timeago'
import Poll from 'lib/site/topic-layout/topic-article/poll/component'
// import { SharerFacebook } from 'ext/lib/site/sharer'

export default ({ forum, topic }) => {
  const votes = topic.action.pollResults.length

  return (
    <div className='ext-topic-card consultas-topic-card'>
      {topic.coverUrl && (
        <Link
          to={topic.url}
          className='topic-card-cover'
          style={{ backgroundImage: `url(${topic.coverUrl})` }} />
      )}
      <div className='topic-card-info'>
        <h1 className='topic-card-title'>
          <Link to={topic.url}>{topic.mediaTitle}</Link>
        </h1>
        {topic.action.method && topic.action.method === 'poll' && (
          <Poll
            topic={topic}
            canVoteAndComment={forum.privileges.canVoteAndComment} />
        )}
        <div className='topic-card-footer-container'>
          <div className='topic-card-footer'>
            <div className='poll-participants'>
              <span>{`${votes} participante${votes !== 1 ? 's' : ''}`}</span>
            </div>
            {topic.closingAt && (
              <div className='closing-at'>
                <span className='icon-clock' />
                {' '}
                {topic.status === 'closed' && (
                  <span>
                    Cerró el {moment(topic.createdAt).format('D/M/YY')}
                  </span>
                )}
                {topic.status === 'open' && (
                  <span>
                    Cierra <Timeago date={topic.closingAt} />
                  </span>
                )}
              </div>
            )}
            {!topic.closingAt && (
              <div className='created-at'>
                <span>{moment(topic.createdAt).format('D/M/YY')}</span>
              </div>
            )}
            <div className='comments'>
              <Link to={topic.url}>
                <span className='icon-bubbles' />
                {' '}
                <span>Comentá</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// const Sharer = ({ topic }) => {
//   const topicUrl = `${window.location.origin}${topic.url}`
//
//   const twitterDesc = encodeURIComponent(`Mirá el proyecto que quiero para mi barrio ${topicUrl} #YoVotoPorMiBarrio`)
//
//   return (
//     <div className='social-links'>
//       <SharerFacebook
//         className='fb'
//         params={{ picture: topic.coverUrl, link: topicUrl }} />
//       <span
//         onClick={handleLinkClick}
//         target='_blank'
//         href={`http://twitter.com/home?status=${twitterDesc}`}>
//         <i className='icon-social-twitter' />
//       </span>
//     </div>
//   )
// }
//
// function handleLinkClick (evt) {
//   const link = evt.currentTarget
//   evt.preventDefault()
//   window.open(link.getAttribute('href'), '_blank')
// }
