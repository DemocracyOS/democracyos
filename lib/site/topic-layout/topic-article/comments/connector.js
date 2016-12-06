import {connect} from 'react-refetch'
import parseComment from './parse-comment'

export default connect.defaults({
  handleResponse: handleResponse
})((props) => {
  const commentsSync = commentsSyncFactory()

  const commentsFetch = {
    url: `/api/v2/comments?topicId=${props.topic.id}`,
    then: (body) => commentsSync(body).all()
  }

  const handleVote = (value, id) => ({
    commentsVoting: {
      url: `/api/v2/comments/${id}/vote`,
      method: 'POST',
      body: JSON.stringify({value}),
      force: true,
      andThen: (body) => ({
        commentsFetch: commentsSync(body).one()
      })
    }
  })

  const handleUnvote = (id) => ({
    commentsUnvoting: {
      url: `/api/v2/comments/${id}/vote`,
      method: 'DELETE',
      force: true,
      andThen: (body) => ({
        commentsFetch: commentsSync(body).one()
      })
    }
  })

  const handleCreate = (data) => {
    const body = Object.assign({}, data, {topicId: props.topic.id})

    return {
      commentsCreating: {
        url: `/api/v2/comments`,
        method: 'POST',
        force: true,
        body: JSON.stringify(body),
        andThen: (body) => ({
          commentsFetch: commentsSync(body).one()
        })
      }
    }
  }

  const handleReply = (data) => {
    return {
      commentsReplying: {
        url: `/api/v2/comments/${data.id}/reply`,
        method: 'POST',
        force: true,
        body: JSON.stringify(data),
        andThen: (body) => ({
          commentsFetch: commentsSync(body).one()
        })
      }
    }
  }

  const handleDelete = (data) => {
    return {
      commentDeleting: {
        url: `/api/v2/comments/${data.id}`,
        method: 'DELETE',
        force: true,
        body: JSON.stringify(data),
        andThen: (body) => ({
          commentsFetch: commentsSync(body).one()
        })
      }
    }
  }

  const handleDeleteReply = (data) => {
    return {
      commentDeleting: {
        url: `/api/v2/comments/${data.id}/replies/${data.replyId}`,
        method: 'DELETE',
        force: true,
        body: JSON.stringify(data),
        andThen: (body) => ({
          commentsFetch: commentsSync(body).one()
        })
      }
    }
  }

  const handleFlag = (id) => ({
    commentsFlagging: {
      url: `/api/v2/comments/${id}/flag`,
      method: 'POST',
      force: true,
      andThen: (body) => ({
        commentsFetch: commentsSync(body).one()
      })
    }
  })

  const handleUnflag = (id) => ({
    commentsUnflagging: {
      url: `/api/v2/comments/${id}/unflag`,
      method: 'POST',
      force: true,
      andThen: (body) => ({
        commentsFetch: commentsSync(body).one()
      })
    }
  })

  return {
    commentsFetch,
    handleUpvote: handleVote.bind(null, 'positive'),
    handleDownvote: handleVote.bind(null, 'negative'),
    handleUnvote,
    handleCreate,
    handleReply,
    handleDelete,
    handleDeleteReply,
    handleFlag,
    handleUnflag
  }
})

function commentsSyncFactory () {
  let commentsCache = []

  return function commentsSync (body) {
    const result = {value: commentsCache}
    return {
      one: function commentsSyncOne () {
        const comment = body.results.comment
        const i = commentsCache.findIndex((c) => c.id === comment.id)

        if (i === -1) {
          commentsCache.unshift(comment)
        } else if (comment.removed) {
          commentsCache.splice(i, 1)
        } else {
          commentsCache[i] = comment
        }

        result.force = true
        result.refreshing = true
        return result
      },
      all: function commentsSyncAll () {
        result.value = commentsCache = body.results.comments
        result.refreshing = true
        result.force = true
        return result
      }
    }
  }
}

function handleResponse (response) {
  const isEmptyResponse = response.headers.get('content-length') === '0'

  if (isEmptyResponse || response.status === 204) return

  const json = response.json()

  if (response.status < 200 || response.status > 300) {
    return json.then((cause) => Promise.reject(cause))
  }

  return json.then(parseResponseComments).then(parseResponseComment)
}

function parseResponseComments (body) {
  if (!body.results || !body.results.comments) return body
  return Promise.all(body.results.comments.map(parseComment))
    .then((comments) => {
      body.results.comments = comments
      return body
    })
}

function parseResponseComment (body) {
  if (!body.results || !body.results.comment) return body
  return parseComment(body.results.comment)
    .then((comment) => {
      body.results.comment = comment
      return body
    })
}
