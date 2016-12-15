import React from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default function ReplyHeader (props) {
  return (
    <header className='meta'>
      <img
        className='avatar'
        src={props.avatar}
        alt={props.fullName} />
      <h3 className='name'>{props.displayName}</h3>
      <div className='created-at'>
        <Timeago date={props.createdAt} />
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
