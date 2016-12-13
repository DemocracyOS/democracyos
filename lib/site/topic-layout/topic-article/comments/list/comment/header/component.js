import React from 'react'
import t from 't-component'
import Timeago from 'lib/site/timeago'

export default function CommentHeader (props) {
  const {comment} = props

  return (
    <header className='meta'>
      <img className='avatar'
        src={comment.author.avatar}
        alt={comment.author.fullName} />
      <h3 className='name'>{comment.author.displayName}</h3>
      <div className='created-at'>
        <Timeago date={comment.createdAt} />
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
        )
      }
    </header>
  )
}
