import React, {Component} from 'react'
import t from 't-component'
import CommentsForm from './form/component'
import CommentsList from './list/component'
import commentsConnector from './connector'

class Comments extends Component {
  render () {
    const {commentsFetch} = this.props

    return (
      <div className='topic-comments'>
        <div className='topic-article-content'>
          <h2 className='topic-comments-title'>
            {t('comments.arguments')}
          </h2>
          <CommentsForm
            forum={this.props.forum}
            onSubmit={this.props.handleCreate}
            commentsCreating={this.props.commentsCreating} />
          {commentsFetch.fulfilled && (
            <CommentsList
              comments={commentsFetch.value}
              onUnvote={this.props.handleUnvote}
              onUpvote={this.props.handleUpvote}
              onDownvote={this.props.handleDownvote} />
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
