import React from 'react'
import Comment from './comment/component'

export default function CommentsList (props) {
  const comments = props.comments || []

  return (
    <div
      className={`comments-list${props.loading ? ' loading' : ''}`}>
      {
        comments.map((item) => {
          const handlers = {
            onUnvote: () => props.onUnvote(item.id),
            onUpvote: () => props.onUpvote(item.id),
            onDownvote: () => props.onDownvote(item.id),
            onFlag: () => props.onFlag(item.id),
            onUnflag: () => props.onUnflag(item.id)
          }

          return (
            <Comment
              key={item.id}
              comment={item}
              onReply={props.onReply}
              commentsReplying={props.commentsReplying}
              onEdit={props.onEdit}
              onReplyEdit={props.onReplyEdit}
              onDelete={props.onDelete}
              onDeleteReply={props.onDeleteReply}
              commentDeleting={props.commentDeleting}
              forum={props.forum}
              topic={props.topic}
              {...handlers} />
          )
        })
      }
    </div>
  )
}
