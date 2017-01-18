import {connect} from 'react-refetch'
import parseComment from './parse-comment'

const commentsSync = commentsSyncFactory()

export default connect.defaults({
  handleResponse: handleResponse
})((props) => {
  const params = {
    topicId: props.topic.id,
    sort: '-score'
  }

  const commentsSyncOne = (body) => ({commentsFetch: commentsSync.one(body)})

  const fetchUrl = () => (`/api/v2/comments${objectToParams(params)}`)

  const commentsFetch = {
    url: fetchUrl(),
    then: commentsSync.all
  }

  const handleSort = (sort) => {
    params.sort = sort

    return {
      commentsFetch: {
        url: fetchUrl(),
        then: commentsSync.all
      }
    }
  }

  const handleVote = (value, id) => ({
    commentsVoting: {
      url: `/api/v2/comments/${id}/vote`,
      method: 'POST',
      body: JSON.stringify({value}),
      force: true,
      andThen: commentsSyncOne
    }
  })

  const handleUnvote = (id) => ({
    commentsUnvoting: {
      url: `/api/v2/comments/${id}/vote`,
      method: 'DELETE',
      force: true,
      andThen: commentsSyncOne
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
        andThen: commentsSyncOne
      }
    }
  }

  const handleReply = (data) => ({
    commentsReplying: {
      url: `/api/v2/comments/${data.id}/reply`,
      method: 'POST',
      force: true,
      body: JSON.stringify(data),
      andThen: commentsSyncOne
    }
  })

  const handleDelete = (data) => ({
    commentDeleting: {
      url: `/api/v2/comments/${data.id}`,
      method: 'DELETE',
      force: true,
      body: JSON.stringify(data),
      andThen: () => ({commentsFetch: commentsSync.remove(data.id)})
    }
  })

  const handleDeleteReply = (data) => ({
    commentDeleting: {
      url: `/api/v2/comments/${data.id}/replies/${data.replyId}`,
      method: 'DELETE',
      force: true,
      body: JSON.stringify(data),
      andThen: commentsSyncOne
    }
  })

  const handleFlag = (id) => ({
    commentsFlagging: {
      url: `/api/v2/comments/${id}/flag`,
      method: 'POST',
      force: true,
      andThen: commentsSyncOne
    }
  })

  const handleUnflag = (id) => ({
    commentsUnflagging: {
      url: `/api/v2/comments/${id}/unflag`,
      method: 'POST',
      force: true,
      andThen: commentsSyncOne
    }
  })

  const handleEdit = (id, text) => ({
    commentsUnflagging: {
      url: `/api/v2/comments/${id}`,
      method: 'PUT',
      force: true,
      body: JSON.stringify({text}),
      andThen: commentsSyncOne
    }
  })

  const handleReplyEdit = (id, replyId, text) => ({
    commentsUnflagging: {
      url: `/api/v2/comments/${id}/replies/${replyId}`,
      method: 'PUT',
      force: true,
      body: JSON.stringify({text}),
      andThen: commentsSyncOne
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
    handleUnflag,
    handleEdit,
    handleReplyEdit,
    handleSort
  }
})

function commentsSyncFactory () {
  let commentsCache = []

  return {
    one (body) {
      const comment = body.results.comment
      const i = commentsCache.findIndex((c) => c.id === comment.id)

      if (i === -1) {
        commentsCache.unshift(comment)
      } else {
        commentsCache[i] = comment
      }

      return {
        value: commentsCache,
        force: true,
        refreshing: true
      }
    },

    all (body) {
      commentsCache = body.results.comments

      return {
        value: commentsCache,
        force: true,
        refreshing: true
      }
    },

    remove (id) {
      const i = commentsCache.findIndex((c) => c.id === id)

      if (i > -1) commentsCache.splice(i, 1)

      return {
        value: commentsCache,
        force: true,
        refreshing: true
      }
    }
  }
}

function handleResponse (response) {
  const isEmptyResponse = response.headers.get('content-length') === '0'

  if (isEmptyResponse || response.status === 204) return

  const json = response.json()

  if (response.status < 200 || response.status > 300) {
    return json.then((err) => Promise.reject(err))
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

function objectToParams (obj = {}) {
  const vals = Object.keys(obj)
    .map((k) => `${k}=${encodeURIComponent(obj[k])}`)
    .join('&')

  return vals ? '?' + vals : ''
}
