import React from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default function CommentHeader (props) {
  const {comment} = props

  return (
    <header className='meta'>
      <img
        className='avatar'
        src={comment.author.avatar}
        alt={comment.author.fullName} />
      <h3 className='name'>
        {comment.author.displayName}
        {
          comment.author.badge && (
            <span className='valid-badge'>{comment.author.badge}</span>
          )
        }
      </h3>
      <div className='created-at'>
        <Timeago date={comment.createdAt} />
      </div>
      {
        !!props.user &&
        (
          <div
            className='options'
            onClick={props.onToggleOptionsMenu}>
            <button className='arrow'>
              <i className='icon-arrow-down' />
            </button>
            {
              props.showOptionsMenu &&
              (
                <div
                  className='options-menu'>
                  {
                    (props.isOwner || (props.user && props.user.staff)) &&
                    (
                      <button onClick={props.onToggleDeleteConfirmation}>
                        {t('comment-card.remove-argument')}
                      </button>
                    )
                  }
                  {
                    props.isOwner &&
                    (
                      <button
                        onClick={props.onEditShow}>
                        {t('comments.edit.argument')}
                      </button>
                    )
                  }
                  {
                    !props.isOwner &&
                    !!~props.flags.map((flag) => flag.author).indexOf(props.user.id) &&
                    (
                      <button onClick={props.onUnflag}>
                        {t('comment-card.not-spam')}
                        {props.flags.length > 0 && ' (' + props.flags.length + ')'}
                      </button>
                    )
                  }
                  {
                    !props.isOwner &&
                    !~props.flags.map((flag) => flag.author).indexOf(props.user.id) &&
                    (
                      <button onClick={props.onFlag}>
                        {t('comment-card.report-spam')}
                        {props.flags.length > 0 && ' (' + props.flags.length + ')'}
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
