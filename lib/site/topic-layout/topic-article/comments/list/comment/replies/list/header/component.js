import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default ReactOutsideEvent(class ReplyHeader extends Component {
  onOutsideEvent = () => {
    if (!this.props.showOptionsMenu) return
    this.props.onToggleOptionsMenu()
  }

  render () {
    const { reply } = this.props
    return (
      <header className={`meta ${(reply.author.badge ? ' has-badge' : '')}`}>
        <img
          className='avatar'
          src={reply.author.avatar}
          alt={reply.author.fullName} />
        <h3 className='name'>
          {reply.author.displayName}
          <div className='created-at'>
            <Timeago date={reply.createdAt} />
          </div>
          {
            reply.author.badge && (
              <span className='valid-badge'>{reply.author.badge}</span>
            )
          }
        </h3>
        {
          (this.props.isOwner || this.props.forum.privileges.canDeleteComments) &&
          (
            <div
              className='options'
              onClick={this.props.onToggleOptionsMenu}>
              <button className='arrow'>
                <i className='icon-arrow-down' />
              </button>
              {
                this.props.showOptionsMenu &&
                (
                  <div
                    className='options-menu comments-dropdown'>
                    {
                      (this.props.isOwner || this.props.forum.privileges.canDeleteComments) &&
                      (
                        <button onClick={this.props.onToggleDeleteConfirmation}>
                          {t('comment-card.remove-argument')}
                        </button>
                      )
                    }
                    {
                      this.props.isOwner &&
                      (
                        <button
                          onClick={this.props.onEditShow}>
                          {t('comments.edit.argument')}
                        </button>
                      )
                    }
                  </div>
                )
              }
            </div>
          )
        }
      </header>
    )
  }
})
