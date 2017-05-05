import React, {Component} from 'react'
import Timeago from 'lib/site/timeago'
import ValidatedBadge from '../validated-badge/component'

export default function RepliesList (props) {
  const replies = props.replies || []

  return (
    <div
      className={`replies-list ${replies.length === 0 ? 'no-replies' : ''}`}>
      {
        replies.map((item, i) => <Reply key={i} reply={item} />)
      }
    </div>
  )
}

function Reply (props) {
  const {reply} = props

  return (
    <article className='replies-list-item' id={`comment-${reply.id}`}>
      <header className='meta'>
        <img
          className='avatar'
          src={reply.author.avatar}
          alt={reply.author.fullName} />
        <h3 className='name'>
          {reply.author.displayName}
        </h3>
        <ValidatedBadge comment={reply} />
        <div className='created-at'>
          <Timeago date={reply.createdAt} />
        </div>
      </header>
      <div
        className='text'
        dangerouslySetInnerHTML={{__html: reply.textHtml}} />
    </article>
  )
}
