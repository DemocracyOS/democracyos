import React from 'react'
import t from 't-component'
import AutoGrowTextarea from 'lib/site/topic-layout/topic-article/comments/form/autogrow-textarea'

export default function CommentContent (props) {
  let Content = (
    <div
      className='text'
      dangerouslySetInnerHTML={props.textHtml} />
  )

  if (props.isOwner && props.editing) {
    Content = (
      <form
        className='edit-form'
        onSubmit={props.handleEdit}>
        <AutoGrowTextarea
          autoFocus
          defaultValue={props.text} />
        <button
          type='submit'
          className='btn btn-sm btn-success'>
          {t('common.ok')}
        </button>
        <button
          onClick={props.handleHideEdit}
          className='btn btn-sm btn-default'>
          {t('common.cancel')}
        </button>
      </form>
    )
  }

  return Content
}
