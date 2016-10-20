import React from 'react'

export default function CommentsList (props) {
  const comments = props.comments || []

  return (
    <div className='comments-list'>
      {comments.map((item) => {
        return <Item key={item.id} {...item} />
      })}
    </div>
  )
}

function Item (item) {
  return (
    <article className='comments-list-item' id={`comment-${item.id}`}>
      <div className='meta'>
        <img
          className='avatar'
          src={item.author.avatar}
          alt={item.author.fullName} />
        <h3 className='name'>{item.author.displayName}</h3>
      </div>
      <div
        className='text'
        dangerouslySetInnerHTML={{__html: item.textHtml}} />
    </article>
  )
}
