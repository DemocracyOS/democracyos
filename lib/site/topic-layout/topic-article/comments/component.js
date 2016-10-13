import React, {Component} from 'react'
import {connect} from 'react-refetch'

class Comments extends Component {
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
    const {commentsFetch} = this.props

    if (commentsFetch.pending) return null

    if (commentsFetch.rejected) {
      return (
        <div className='alert alert-danger' role='alert'>Error</div>
      )
    }

    const onLastPage = this.state.page === this.state.pageCount

    return (
      <div className='topic-comments'>
        <div className='comments-list'>
          {
            commentsFetch.value.map((comment) => {
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

export default connect((props) => ({
  commentsFetch: {
    url: `/api/v2/comments?topicId=${props.topic.id}`,
    then: (body) => ({
      value: body.results.comments
    })
  }
}))(Comments)
