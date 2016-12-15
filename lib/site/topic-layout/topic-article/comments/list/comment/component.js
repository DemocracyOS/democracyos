import React, {Component} from 'react'
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
      isSpam: false,
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
        isSpam: true,
        overlayActive: 'IS_SPAM',
        overlayVisibility: true
      })
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
    const text = e.target[0].value
    this.props.onEdit(this.props.comment.id, text)
    this.setState({editing: false})
    e.preventDefault()
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
      <article
        className={
          `comments-list-item ${(
            this.state.overlayVisibility &&
            this.state.overlayActive === 'IS_SPAM'
          ) ? 'on-spam' : ''}`
        } id={`comment-${comment.id}`}>
        <CommentHeader
          comment={comment}
          isOwner={isOwner}
          onToggleOptionsMenu={this.handleToggleOptionsMenu}
          onEditShow={this.handleEditShow(true)}
          showOptionsMenu={this.state.showOptionsMenu}
          onToggleDeleteConfirmation={this.handleShowOverlay('CONFIRM_REMOVE')}
          user={user.state.value || null}
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
          commentsReplying={this.props.commentsReplying} />

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

        {
          this.state.overlayVisibility &&
          this.state.overlayActive === 'IS_SPAM' &&
          (
            <div className='comment-overlay spam'>
              <p>{t('comment-card.flagged-as-spam')}</p>
              <div>
                <button
                  onClick={this.handleHideOverlay}
                  className='btn btn-sm btn-default'>
                  {t('comment-card.show')}
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
