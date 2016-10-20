import React, {Component} from 'react'
import Timeago from 'lib/site/timeago'

export default function CommentsList (props) {
  const comments = props.comments || []

  return (
    <div className='comments-list'>
      {comments.map((item) => {
        return <Comment key={item.id} {...item} />
      })}
    </div>
  )
}

function Comment (props) {
  return (
    <article className='comments-list-item' id={`comment-${props.id}`}>
      <div className='meta'>
        <img
          className='avatar'
          src={props.author.avatar}
          alt={props.author.fullName} />
        <h3 className='name'>{props.author.displayName}</h3>
        <div className='created-at'>
          <Timeago date={props.createdAt} />
        </div>
      </div>
      <div
        className='text'
        dangerouslySetInnerHTML={{__html: props.textHtml}} />
    </article>
  )
}
