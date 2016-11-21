import React, {Component} from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'
import userConnector from 'lib/site/connectors/user'
import CommentReplies from './replies/component'

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

          return (
            <Comment
              key={item.id}
              comment={item}
              onReply={props.onReply}
              commentsReplying={props.commentsReplying}
              onDelete={props.onDelete}
              commentDeleting={props.commentDeleting}
              {...handlers}
              forum={props.forum} />
          )
        })
      }
    </div>
  )
}

class OptionsTooltip extends Component {
  constructor (props) {
    super(props)

    this.state = OptionsTooltip.getInitialState()
  }

  static getInitialState () {
    return {
      showTooltip: false,
      loading: false,
      error: null
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const commentDeleting = nextProps.commentDeleting || {}

    if (commentDeleting.pending) {
      this.setState({
        loading: true,
        error: ''
      })
    } else if (commentDeleting.rejected) {
      this.setState({
        loading: false,
        error: t('modals.error.default')
      })
    } else if (commentDeleting.fulfilled) {
      console.log('delete fulfilled')
      this.setState(OptionsTooltip.getInitialState())
    }
  }

  handleToggleTooltip = () => {
    this.setState({showTooltip: !this.state.showTooltip})
  }

  handleDelete = () => {
    this.props.onDelete({id: this.props.id})
  }

  render () {
    return (
      <div
        className='options'
        onClick={this.handleToggleTooltip}>
        <button className='arrow'>
          <i className='icon-arrow-down' />
        </button>
        {
          this.state.showTooltip &&
          (
            <div
              className='options-tooltip'
              disabled={this.state.loading}>
              <button onClick={this.handleDelete}>
                {t('comment-card.remove-argument')}
              </button>
            </div>
          )
        }
      </div>
    )
  }
}

const Comment = userConnector(class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      repliesVisibility: false
    }
  }

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

  handleToggleReplies = () => {
    this.setState({repliesVisibility: !this.state.repliesVisibility})
  }

  render () {
    const {
      comment,
      user,
      forum
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
          {
            (isOwner || forum.privileges.canEdit) &&
              <OptionsTooltip
                id={comment.id}
                onDelete={this.props.onDelete}
                commentDeleting={this.props.commentDeleting} />
          }
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
          <div className='replies-score'>
            {!!comment.repliesCount && (
              <span className='score'>
                <span>{comment.repliesCount}</span>
                {' '}
                <small>{t('comments.replies')}</small>
              </span>
            )}
            <button
              className='reply'
              title={t('comments.arguments.reply')}
              onClick={this.handleToggleReplies}>
              <i className='icon-action-redo' />
            </button>
          </div>
        </footer>
        <CommentReplies
          commentId={comment.id}
          replies={comment.replies}
          forum={forum}
          user={user}
          repliesVisibility={this.state.repliesVisibility}
          onReply={this.props.onReply}
          commentsReplying={this.props.commentsReplying} />
      </article>
    )
  }
})
