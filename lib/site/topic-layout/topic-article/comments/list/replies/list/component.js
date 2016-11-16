import React, {Component} from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'
import userConnector from 'lib/site/connectors/user'

export default function RepliesList (props) {
  const replies = props.replies || []

  return (
    <div className='replies-list'>
      {
        replies.map((item) => {
          const handlers = {
            onUnvote: () => props.onUnvote(item.id),
            onUpvote: () => props.onUpvote(item.id),
            onDownvote: () => props.onDownvote(item.id)
          }

          return <Reply key={item.id} reply={item} {...handlers} />
        })
      }
    </div>
  )
}

const Reply = userConnector(class extends Component {
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
      reply,
      user
    } = this.props

    if (user.state.pending) return null

    const {upvoted, downvoted} = (reply.currentUser || {})
    const userAttrs = user.state.value || {}
    const isOwner = userAttrs.id === reply.author.id

    return (
      <article className='replies-list-item' id={`comment-${reply.id}`}>
        <header className='meta'>
          <img
            className='avatar'
            src={reply.author.avatar}
            alt={reply.author.fullName} />
          <h3 className='name'>{reply.author.displayName}</h3>
          <div className='created-at'>
            <Timeago date={reply.createdAt} />
          </div>
        </header>
        <div
          className='text'
          dangerouslySetInnerHTML={{__html: reply.textHtml}} />
        <footer className='actions'>
          <div className='votes'>
            <span className='score'>
              <span>{reply.score}</span>
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
