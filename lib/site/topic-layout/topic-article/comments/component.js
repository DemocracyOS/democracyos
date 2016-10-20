import React, {Component} from 'react'
import {connect} from 'react-refetch'
import t from 't-component'
import CommentsList from './list/component'
import parseComment from './parse-comment'

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

    return (
      <div className='topic-comments'>
        <div className='topic-article-content'>
          <h5 className='topic-comments-title'>
            {t('comments.arguments')}
          </h5>
          {commentsFetch.fulfilled && (
            <CommentsList comments={commentsFetch.value} />
          )}
          {commentsFetch.rejected && (
            <div className='alert alert-danger' role='alert'>
              {t('modals.error.default')}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default connect((props) => ({
  commentsFetch: {
    url: `/api/v2/comments?topicId=${props.topic.id}`,
    then: (body) => ({
      value: Promise.all(body.results.comments.map(parseComment))
    })
  }
}))(Comments)
