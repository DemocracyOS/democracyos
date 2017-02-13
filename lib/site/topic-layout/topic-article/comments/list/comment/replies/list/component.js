import React, {Component} from 'react'
import t from 't-component'
import ReplyHeader from './header/component'
import ReplyContent from './content/component'

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
              onReplyEdit={props.onReplyEdit}
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
      deleteConfirmationVisibility: false,
      editing: false
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

  handleEditShow = (bool) => () => {
    this.setState({editing: bool})
  }

  handleEdit = (e) => {
    e.preventDefault()
    const text = e.target[0].value
    const id = this.props.commentId
    const replyId = this.props.reply._id
    this.props.onReplyEdit(id, replyId, text)
    this.setState({editing: false})
  }

  render () {
    const {reply, user, forum} = this.props
    const userAttrs = user.state.value || {}
    const isOwner = userAttrs.id === reply.author.id

    return (
      <article className='replies-list-item' id={`comment-${reply.id}`}>
        <ReplyHeader
          reply={reply}
          isOwner={isOwner}
          forum={forum}
          staff={user.staff}
          onToggleOptionsMenu={this.handleToggleOptionsMenu}
          showOptionsMenu={this.state.showOptionsMenu}
          onEditShow={this.handleEditShow(true)}
          onToggleDeleteConfirmation={this.handleToggleDeleteConfirmation} />

        <ReplyContent
          textHtml={reply.textHtml}
          isOwner={isOwner}
          editing={this.state.editing}
          text={reply.text}
          onHandleEdit={this.handleEdit}
          handleHideEdit={this.handleEditShow(false)} />

        {
          this.state.deleteConfirmationVisibility && (
            <div className='comment-overlay delete-reply'>
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
