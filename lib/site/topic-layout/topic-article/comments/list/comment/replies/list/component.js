import React, {Component} from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default function RepliesList (props) {
  const replies = props.replies || []

  return (
    <div
      className={`replies-list ${replies.length === 0 ? 'no-replies' : ''}`}>
      {
        replies.map((item, i) => {
          return (
            <Reply
              key={i}
              reply={item}
              user={props.user}
              commentId={props.commentId}
              forum={props.forum}
              onDeleteReply={props.onDeleteReply} />
          )
        })
      }
    </div>
  )
}

class Reply extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showOptionsMenu: false,
      deleteConfirmationVisibility: false
    }
  }

  handleToggleOptionsMenu = () => {
    this.setState({showOptionsMenu: !this.state.showOptionsMenu})
  }

  handleToggleDeleteConfirmation = () => {
    this.setState({deleteConfirmationVisibility: !this.state.deleteConfirmationVisibility})
  }

  handleDelete = () => {
    this.setState({deleteConfirmationVisibility: false})
    this.props.onDeleteReply({id: this.props.commentId, replyId: this.props.reply._id})
  }

  render () {
    const {reply, user, forum} = this.props
    const userAttrs = user.state.value || {}
    const isOwner = userAttrs.id === reply.author.id
    const canEdit = forum.privileges.canEdit

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
          {
            !!user.state.value &&
            (
              <div
                className='options'
                onClick={this.handleToggleOptionsMenu}>
                <button className='arrow'>
                  <i className='icon-arrow-down' />
                </button>
                {
                  this.state.showOptionsMenu &&
                  (
                    <div
                      className='options-menu'>
                      {
                        (isOwner || canEdit) &&
                        (
                          <button onClick={this.handleToggleDeleteConfirmation}>
                            {t('comment-card.remove-argument')}
                          </button>
                        )
                      }
                      <button>
                        {t('comment-card.report-spam')}
                      </button>
                    </div>
                  )
                }
              </div>
            )
          }
        </header>
        <div
          className='text'
          dangerouslySetInnerHTML={{__html: reply.textHtml}} />
        {
          this.state.deleteConfirmationVisibility && (
            <div className='delete-comment-confirmation delete-reply'>
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
}
