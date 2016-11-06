import React, {Component} from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'
import userConnector from 'lib/site/connectors/user'

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

const Comment = userConnector(class extends Component {
  handleUnvote = (evt) => {
    evt.currentTarget.classList.remove('active')
    this.props.onUnvote()
  }

  handleUpvote = (evt) => {
    evt.currentTarget.classList.add('active')
    this.props.onUpvote()
  }

  handleDownvote = (evt) => {
    evt.currentTarget.classList.add('active')
    this.props.onDownvote()
  }

  render () {
    const {
      comment,
      user
    } = this.props

    if (user.state.pending) return null

    const {upvoted, downvoted} = (comment.currentUser || {})
    const userAttrs = user.state.value || {}
    const isOwner = userAttrs.id === comment.author.id

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
            <span className='score'>
              <span>{comment.score}</span>
              {' '}
              <small>{t('comments.votes')}</small>
            </span>
            {!isOwner && (
              <button
                className={`upvote ${upvoted ? 'active' : ''}`}
                onClick={upvoted ? this.handleUnvote : this.handleUpvote}>
                <i className='icon-like' />
              </button>
            )}
            {!isOwner && (
              <button
                className={`downvote ${downvoted ? 'active' : ''}`}
                onClick={downvoted ? this.handleUnvote : this.handleDownvote}>
                <i className='icon-dislike' />
              </button>
            )}
          </div>
        </footer>
      </article>
    )
  }
})
