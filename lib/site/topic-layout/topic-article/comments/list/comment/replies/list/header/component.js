import React from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default function ReplyHeader (props) {
  const {reply} = props
  return (
    <header className='meta'>
      <img
        className='avatar'
        src={reply.author.avatar}
        alt={reply.author.fullName} />
      <h3 className='name'>
        {reply.author.displayName}
        {
          reply.author.badge && (
            <span className='valid-badge'>{reply.author.badge}</span>
          )
        }
      </h3>
      <div className='created-at'>
        <Timeago date={reply.createdAt} />
      </div>
      {
        (props.isOwner || props.staff) &&
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
                    (props.isOwner || props.staff) &&
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
                </div>
              )
            }
          </div>
        )
      }
    </header>
  )
}
