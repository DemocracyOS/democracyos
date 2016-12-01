import React, {Component} from 'react'
import t from 't-component'
import userConnector from 'lib/site/connectors/user'
import CommentReplies from './replies/component'
import CommentHeader from './header/component'
import CommentFooter from './footer/component'

export default userConnector(class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      repliesVisibility: false,
      deleteConfirmationVisibility: false,
      showOptionsMenu: false
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

  handleToggleDeleteConfirmation = () => {
    this.setState({deleteConfirmationVisibility: !this.state.deleteConfirmationVisibility})
  }

  handleDelete = () => {
    this.props.onDelete({id: this.props.comment.id})
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
        <CommentHeader
          avatar={comment.author.avatar}
          fullName={comment.author.fullName}
          displayName={comment.author.displayName}
          createdAt={comment.createdAt}
          isOwner={isOwner}
          canEdit={forum.privileges.canEdit}
          onToggleOptionsMenu={this.handleToggleOptionsMenu}
          showOptionsMenu={this.state.showOptionsMenu}
          onToggleDeleteConfirmation={this.handleToggleDeleteConfirmation}
          user={user} />

        <div
          className='text'
          dangerouslySetInnerHTML={{__html: comment.textHtml}} />

        <CommentFooter
          isOwner={isOwner}
          upvoted={upvoted}
          downvoted={downvoted}
          score={comment.score}
          onUnvote={this.handleUnvote}
          onUpvote={this.handleUpvote}
          onDownvote={this.handleDownvote}
          repliesCount={comment.repliesCount}
          onToggleReplies={this.handleToggleReplies} />

        <CommentReplies
          commentId={comment.id}
          replies={comment.replies}
          forum={forum}
          user={user}
          repliesVisibility={this.state.repliesVisibility}
          onReply={this.props.onReply}
          commentsReplying={this.props.commentsReplying} />

        {
          this.state.deleteConfirmationVisibility && (
            <div className='delete-comment-confirmation'>
              <p>{t('comments.arguments.confirm-remove')}</p>
              <div>
                <button
                  onClick={this.handleToggleDeleteConfirmation}
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
      </article>
    )
  }
})
