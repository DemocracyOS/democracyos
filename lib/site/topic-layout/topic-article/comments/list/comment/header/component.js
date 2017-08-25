import React, { Component } from 'react'
import ReactOutsideEvent from 'react-outside-event'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default ReactOutsideEvent(class CommentHeader extends Component {
  onOutsideEvent = () => {
    if (!this.props.showOptionsMenu) return
    this.props.onToggleOptionsMenu()
  }

  render () {
    const { comment } = this.props

    return (
      <header className={`meta ${comment.author.badge ? ' has-badge' : ''}`}>
        <img
          className='avatar'
          src={comment.author.avatar}
          alt={comment.author.fullName} />
        <h3 className='name'>
          {comment.author.displayName}
          <div className='created-at'>
            <Timeago date={comment.createdAt} />
          </div>
          {
            comment.author.badge && (
              <span className='valid-badge'>{comment.author.badge}</span>
            )
          }
        </h3>
        {
          !!this.props.user &&
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
                    {
                      !this.props.isOwner &&
                      !!~this.props.flags.map((flag) => flag.author).indexOf(this.props.user.id) &&
                      (
                        <button onClick={this.props.onUnflag}>
                          {t('comment-card.not-spam')}
                          {this.props.flags.length > 0 && ' (' + this.props.flags.length + ')'}
                        </button>
                      )
                    }
                    {
                      !this.props.isOwner &&
                      !~this.props.flags.map((flag) => flag.author).indexOf(this.props.user.id) &&
                      (
                        <button onClick={this.props.onFlag}>
                          {t('comment-card.report-spam')}
                          {this.props.flags.length > 0 && ' (' + this.props.flags.length + ')'}
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
