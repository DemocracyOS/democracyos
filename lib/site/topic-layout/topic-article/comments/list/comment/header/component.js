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
      <div
        className='options'
        onClick={props.onToggleTooltip}>
        <button className='arrow'>
          <i className='icon-arrow-down' />
        </button>
        {
          props.showTooltip &&
          (
            <div
              className='options-tooltip'>
              {
                (props.isOwner || props.canEdit) &&
                (
                  <button onClick={props.onToggleDeleteConfirmation}>
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
    </header>
  )
}
