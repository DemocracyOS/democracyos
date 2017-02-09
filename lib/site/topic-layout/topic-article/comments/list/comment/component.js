import React, {Component} from 'react'
import {Link} from 'react-router'
import t from 't-component'
import config from 'lib/config'
import userConnector from 'lib/site/connectors/user'
import CommentReplies from './replies/component'
import CommentHeader from './header/component'
import CommentFooter from './footer/component'
import CommentContent from './content/component'

export class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      repliesVisibility: false,
      showOptionsMenu: false,
      commentDeletingPending: false,
      overlayActive: '',
      overlayVisibility: false,
      editing: false
    }
  }

  componentWillReceiveProps (props) {
    if (props.commentDeleting) {
      if (
        props.commentDeleting.rejected &&
        props.commentDeleting.reason.error.code === 'HAS_REPLIES' &&
        this.state.commentDeletingPending
      ) {
        this.setState({
          overlayActive: 'HAS_REPLIES_ERR',
          overlayVisibility: true
        })
      } else if (!props.commentDeleting.pending) {
        this.setState({commentDeletingPending: false})
      }
    }
  }

  componentWillMount () {
    if (this.props.comment.flags.length >= config.spamLimit) {
      this.setState({
        overlayActive: 'IS_SPAM',
        overlayVisibility: true
      })
    }
  }

  handleUnvote = (evt) => {
    if (this.showNeedsLoginOverlay()) return
    evt.currentTarget.classList.remove('active')
    this.props.onUnvote()
  }

  handleUpvote = (evt) => {
    if (this.showNeedsLoginOverlay()) return
    evt.currentTarget.classList.add('active')
    this.props.onUpvote()
  }

  handleDownvote = (evt) => {
    if (this.showNeedsLoginOverlay()) return
    evt.currentTarget.classList.add('active')
    this.props.onDownvote()
  }

  showNeedsLoginOverlay = () => {
    if (this.props.user.state.pending) return true

    if (this.props.user.state.rejected) {
      this.setState({
        overlayActive: 'NEEDS_LOGIN',
        overlayVisibility: true
      })

      return true
    }

    return false
  }

  handleToggleReplies = () => {
    this.setState({repliesVisibility: !this.state.repliesVisibility})
  }

  handleToggleOptionsMenu = () => {
    this.setState({showOptionsMenu: !this.state.showOptionsMenu})
  }

  handleHideOverlay = () => {
    this.setState({
      overlayVisibility: false
    })
  }

  handleShowOverlay = (active) => () => {
    this.setState({
      overlayVisibility: true,
      overlayActive: active
    })
  }

  handleDelete = () => {
    this.setState({
      overlayVisibility: false,
      commentDeletingPending: true
    })
    this.props.onDelete({id: this.props.comment.id})
  }

  handleEditShow = (bool) => () => {
    this.setState({editing: bool})
  }

  handleEdit = (e) => {
    e.preventDefault()
    const text = e.target[0].value
    this.props.onEdit(this.props.comment.id, text)
    this.setState({editing: false})
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

    if (this.state.overlayVisibility &&
        this.state.overlayActive === 'IS_SPAM') {
      return (
        <article
          className='comments-list-item is-spam'
          id={`comment-${comment.id}`}>
          <span>{t('comment-card.flagged-as-spam')}</span>
          {' '}
          <span className='show-spam btn-link' onClick={this.handleHideOverlay}>
            {t('comment-card.show')}
          </span>
        </article>
      )
    }

    return (
      <article className='comments-list-item' id={`comment-${comment.id}`}>
        <CommentHeader
          comment={comment}
          isOwner={isOwner}
          onToggleOptionsMenu={this.handleToggleOptionsMenu}
          onEditShow={this.handleEditShow(true)}
          showOptionsMenu={this.state.showOptionsMenu}
          onToggleDeleteConfirmation={this.handleShowOverlay('CONFIRM_REMOVE')}
          user={user.state.value || null}
          forum={forum}
          flags={comment.flags}
          commentId={comment.id}
          onFlag={this.props.onFlag}
          onUnflag={this.props.onUnflag} />

        <CommentContent
          textHtml={comment.textHtml}
          isOwner={isOwner}
          editing={this.state.editing}
          text={comment.text}
          onHandleEdit={this.handleEdit}
          handleHideEdit={this.handleEditShow(false)} />

        <CommentFooter
          score={comment.score}
          repliesCount={comment.repliesCount}
          isOwner={isOwner}
          upvoted={upvoted}
          downvoted={downvoted}
          onUnvote={this.handleUnvote}
          onUpvote={this.handleUpvote}
          onDownvote={this.handleDownvote}
          onToggleReplies={this.handleToggleReplies} />

        <CommentReplies
          commentId={comment.id}
          replies={comment.replies}
          forum={forum}
          user={user}
          repliesVisibility={this.state.repliesVisibility}
          onReply={this.props.onReply}
          onDeleteReply={this.props.onDeleteReply}
          onReplyEdit={this.props.onReplyEdit}
          commentsReplying={this.props.commentsReplying} />

        {
          this.state.overlayVisibility &&
          this.state.overlayActive === 'NEEDS_LOGIN' &&
          (
            <div className='comment-overlay' onClick={this.handleHideOverlay}>
              <NeedsLogin comment={comment}/>
            </div>
          )
        }

        {
          this.state.overlayVisibility &&
          this.state.overlayActive === 'CONFIRM_REMOVE' &&
          (
            <div className='comment-overlay'>
              <p>{t('comments.arguments.confirm-remove')}</p>
              <div>
                <button
                  onClick={this.handleHideOverlay}
                  className='btn btn-sm btn-default'>
                  {t('common.cancel')}
                </button>
                <button
                  onClick={this.handleDelete}
                  className='btn btn-sm btn-danger'>
                  {t('common.ok')}
                </button>
              </div>
            </div>
          )
        }

        {
          this.state.overlayVisibility &&
          this.state.overlayActive === 'HAS_REPLIES_ERR' &&
          (
            <div className='comment-overlay'>
              <p>{t('comments.cannot-remove')}</p>
              <div>
                <button
                  onClick={this.handleHideOverlay}
                  className='btn btn-sm btn-default'>
                  {t('common.ok')}
                </button>
              </div>
            </div>
          )
        }
      </article>
    )
  }
}

export default userConnector(Comment)

function NeedsLogin ({ comment }) {
  const ref = `${location.pathname}${location.search}#comment-${comment.id}`

  return (
    <div className='needs-login'>
      {t('comments.sign-in-required')}.{' '}
      <Link to={{pathname: '/signin', query: {ref}}}>
        {t('signin.login')}
      </Link>
      {' '}{t('common.or')}{' '}
      <Link to={{pathname: '/signup', query: {ref}}}>
        {t('signin.signup')}
      </Link>
    </div>
  )
}
