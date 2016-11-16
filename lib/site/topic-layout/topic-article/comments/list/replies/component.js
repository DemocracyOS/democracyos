import React from 'react'
import RepliesForm from './form/component'
import RepliesList from './list/component'

export default function CommentReplies (props) {
  if (!props.repliesVisibility) return null
  return (
    <div className='comments-replies-container'>
      <RepliesList replies={props.replies} />
      <RepliesForm
        commentId={props.commentId}
        onSubmit={props.onReply}
        commentsCreating={props.commentsCreating}
        forum={props.forum} />
    </div>
  )
}
