import {connect} from 'react-refetch'
import parseComment from './parse-comment'

export default connect.defaults({
  handleResponse: function handleResponse (response) {
    const isEmptyResponse = response.headers.get('content-length') === '0'

    if (isEmptyResponse || response.status === 204) return

    const json = response.json()

    if (response.status < 200 || response.status > 300) {
      return json.then((cause) => Promise.reject(new Error(cause)))
    }

    return json.then((body) => {
      console.log('asaaa', body)
      return body
    })
  }
})((props) => ({
  commentsFetch: {
    url: `/api/v2/comments?topicId=${props.topic.id}`,
    then: (body) => ({
      value: Promise.all(body.results.comments.map(parseComment))
    }),
    handleUpvote: (id) => ({
      commentsFetch: {
        url: `/api/v2/comments/${id}/vote`,
        method: 'POST',
        refresh: true,
        body: {type: 'positive'}
      }
    })
  }
}))
