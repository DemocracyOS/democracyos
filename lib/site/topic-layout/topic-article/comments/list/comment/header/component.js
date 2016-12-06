import React from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default function CommentHeader (props) {
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
        !!props.user.state.value &&
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
                    (props.isOwner || props.user.staff) &&
                    (
                      <button onClick={props.onToggleDeleteConfirmation}>
                        {t('comment-card.remove-argument')}
                      </button>
                    )
                  }
                  {
                    props.isOwner &&
                    (
                      <button>
                        {t('comments.edit.argument')}
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
  )
}
