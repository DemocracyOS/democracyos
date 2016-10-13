import React, {Component} from 'react'

export default class Comments extends Component {
  constructor (props) {
    super(props)

    this.state = {
      comments: [],
      page: 0,
      pageCount: 0,
      count: 0
    }
  }

  render () {
    return (
      <div className='topic-comments'>
        <div className='comments-list'>
          {
            this.state.comments.map((comment) => {
              return <Comment key={comment.id} {...comment} />
            })
          }
        </div>
        {!onLastPage && <button type='button'>next</button>}
      </div>
    )
  }
}

function Comment (props) {
  return (
    <div className='comments-list-item'>
      {props.text}
    </div>
  )
}
