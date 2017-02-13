import React from 'react'
import RepliesForm from './form/component'
import RepliesList from './list/component'

export default function CommentReplies (props) {
  if (!props.repliesVisibility) return null
  return (
    <div className='comments-replies-container'>
      <RepliesList
        onDeleteReply={props.onDeleteReply}
        commentId={props.commentId}
        replies={props.replies}
        onReplyEdit={props.onReplyEdit}
        forum={props.forum}
        user={props.user} />
      <RepliesForm
        commentId={props.commentId}
        onSubmit={props.onReply}
        commentsReplying={props.commentsReplying}
        forum={props.forum} />
    </div>
  )
}
