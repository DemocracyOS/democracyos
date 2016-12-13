import React from 'react'
import t from 't-component'

export default function CommentFooter (props) {
  return (
    <footer className='actions'>
      <div className='votes'>
        <span className='score'>
          <span>{props.score}</span>
          {' '}
        </span>
        {!props.isOwner && (
          <button
            className={`upvote ${props.upvoted ? 'active' : ''}`}
            onClick={props.upvoted ? props.onUnvote : props.onUpvote}>
            <i className='icon-like' />
          </button>
        )}
        {!props.isOwner && (
          <button
            className={`downvote ${props.downvoted ? 'active' : ''}`}
            onClick={props.downvoted ? props.onUnvote : props.onDownvote}>
            <i className='icon-dislike' />
          </button>
        )}
      </div>
      <div className='replies-score'>
        <button
          className='reply'
          title={t('comments.arguments.reply')}
          onClick={props.onToggleReplies}>
          {
            !!props.repliesCount &&
            (
              <span className='score'>
                <span>{props.repliesCount}</span>
                {' '}
                <small>
                  {
                    props.repliesCount === 1 ?
                    t('comments.reply') :
                    t('comments.replies')
                  }
                </small>
              </span>
            )
          }
          <i className='icon-action-redo' />
        </button>
      </div>
    </footer>
  )
}
