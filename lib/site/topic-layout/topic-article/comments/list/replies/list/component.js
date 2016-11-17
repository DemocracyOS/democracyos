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

function Reply (props) {
  const {reply, user} = props
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
        {
          (isOwner || forum.privileges.canEdit) &&
            <OptionsTooltip
              id={reply.id}
              onDelete={props.onDelete}
              commentDeleting={props.commentDeleting} />
        }
      </header>
      <div
        className='text'
        dangerouslySetInnerHTML={{__html: reply.textHtml}} />
    </article>
  )
}
