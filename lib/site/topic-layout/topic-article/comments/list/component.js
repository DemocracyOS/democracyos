import React from 'react'
import Timeago from 'lib/site/timeago'

export default function CommentsList (props) {
  const comments = props.comments || []

  return (
    <div className='comments-list'>
      {
        comments.map((item) => {
          const handlers = {
            onUnvote: () => props.onUnvote(item.id),
            onUpvote: () => props.onUpvote(item.id),
            onDownvote: () => props.onDownvote(item.id)
          }

          return <Comment key={item.id} comment={item} {...handlers} />
        })
      }
    </div>
  )
}

function Comment (props) {
  const {comment} = props
  const {upvoted, downvoted} = comment.currentUser

  function onUnvote (evt) {
    evt.currentTarget.classList.remove('active')
    props.onUnvote()
  }

  function onUpvote (evt) {
    evt.currentTarget.classList.add('active')
    props.onUpvote()
  }

  function onDownvote (evt) {
    evt.currentTarget.classList.add('active')
    props.onDownvote()
  }

  return (
    <article className='comments-list-item' id={`comment-${comment.id}`}>
      <header className='meta'>
        <img
          className='avatar'
          src={comment.author.avatar}
          alt={comment.author.fullName} />
        <h3 className='name'>{comment.author.displayName}</h3>
        <div className='created-at'>
          <Timeago date={comment.createdAt} />
        </div>
      </header>
      <div
        className='text'
        dangerouslySetInnerHTML={{__html: comment.textHtml}} />
      <footer className='actions'>
        <div className='votes'>
          <span className='score'>{comment.score}</span>
          <button
            className={`upvote ${upvoted ? 'active' : ''}`}
            onClick={upvoted ? onUnvote : onUpvote}>
            <i className='icon-like' />
          </button>
          <button
            className={`downvote ${downvoted ? 'active' : ''}`}
            onClick={downvoted ? onUnvote : onDownvote}>
            <i className='icon-dislike' />
          </button>
        </div>
      </footer>
    </article>
  )
}
