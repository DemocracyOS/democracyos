import React from 'react'
import t from 't-component'
import AutoGrowTextarea from 'lib/site/topic-layout/topic-article/comments/form/autogrow-textarea'

export default function ReplyContent (props) {
  let Content = (
    <div
      className='text'
      dangerouslySetInnerHTML={{ __html: props.textHtml }} />
  )

  if (props.isOwner && props.editing) {
    Content = (
      <form
        className='edit-form'
        onSubmit={props.onHandleEdit}>
        <AutoGrowTextarea
          autoFocus
          defaultValue={props.text}
          maxLength='4096'
          minLength='1' />
        <button
          type='submit'
          className='btn btn-sm btn-success'>
          {t('common.ok')}
        </button>
        <button
          type='button'
          onClick={props.handleHideEdit}
          className='btn btn-sm btn-default'>
          {t('common.cancel')}
        </button>
      </form>
    )
  }

  return Content
}
