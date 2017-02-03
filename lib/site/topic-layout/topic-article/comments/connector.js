import { connect } from 'react-refetch'
import parseComment from './parse-comment'

const commentsSync = commentsSyncFactory()
const commentsSyncOne = (body) => ({ commentsFetch: commentsSync.one(body) })

export default connect.defaults({
  handleResponse: handleResponse
})((props) => {
  commentsSync.setTopic(props.topic.id)

  const fetchAll = () => ({
    url: `/api/v2/comments${objectToParams(commentsSync.params)}`,
    then: commentsSync.all
  })

  const commentsFetch = fetchAll()

  const handleSort = (sort) => {
    commentsSync.setSort(sort)
    return { commentsFetch: fetchAll() }
  }

  const handleNextPage = () => {
    commentsSync.nextPage()
    return { commentsFetch: fetchAll() }
  }

  const handleVote = (value, id) => ({
    commentsVoting: {
      url: `/api/v2/comments/${id}/vote`,
      method: 'POST',
      body: JSON.stringify({ value }),
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
    const body = Object.assign({}, data, { topicId: props.topic.id })

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
      andThen: () => ({ commentsFetch: commentsSync.remove(data.id) })
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
      body: JSON.stringify({ text }),
      andThen: commentsSyncOne
    }
  })

  const handleReplyEdit = (id, replyId, text) => ({
    commentsUnflagging: {
      url: `/api/v2/comments/${id}/replies/${replyId}`,
      method: 'PUT',
      force: true,
      body: JSON.stringify({ text }),
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
    handleSort,
    handleNextPage
  }
})

function commentsSyncFactory () {
  let items = []

  const params = {
    topicId: null,
    sort: '-score'
  }

  const pagination = {
    count: 0,
    page: 1,
    pageCount: 1
  }

  const sync = {
    get params () {
      return {
        topicId: params.topicId,
        sort: params.sort,
        page: pagination.page
      }
    },

    setTopic (val) {
      if (params.topicId === val) return

      sync.clear()
      params.topicId = val
    },

    setSort (val) {
      if (params.sort === val) return

      sync.clear()
      params.sort = val
    },

    clear () {
      items = []
      pagination.page = 1
    },

    nextPage () {
      if (pagination.page >= pagination.pageCount) {
        throw new Error('Requested an invalid page.')
      }

      pagination.page++
    },

    all (body) {
      if (body.pagination && body.pagination.page === 1) {
        sync.clear()
      }

      items = items.concat(body.results.comments)
      Object.assign(pagination, body.pagination)

      delete body.results

      return {
        value: items.slice(),
        meta: body,
        force: true,
        refreshing: true
      }
    },

    one (body) {
      const comment = body.results.comment
      const i = items.findIndex((c) => c.id === comment.id)

      delete body.results

      if (i === -1) {
        items.unshift(comment)
      } else {
        items[i] = comment
      }

      return {
        value: items,
        meta: body,
        force: true,
        refreshing: true
      }
    },

    remove (id) {
      const i = items.findIndex((c) => c.id === id)

      if (i > -1) items.splice(i, 1)

      return {
        value: items,
        force: true,
        refreshing: true
      }
    }
  }

  return sync
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
