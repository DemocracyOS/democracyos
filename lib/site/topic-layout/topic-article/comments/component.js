import React, {Component} from 'react'
import t from 't-component'
import CommentsList from './list/component'
import commentsConnector from './connector'

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

export default commentsConnector(Comments)
