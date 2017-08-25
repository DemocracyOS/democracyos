import o from 'component-dom'
import serialize from 'get-form-data'
import request from '../../request/request.js'

export default function (form, fn, postserialize) {
  form = o(form)
  var action = form.attr('action')
  var method = form.attr('method').toLowerCase()
  var data = serialize(form[0])
  if (postserialize) postserialize(data)

  if (method === 'delete') {
    method = 'del'
  }

  var req = request[method](action).send(data)
  req.end((err, res) => fn(err, res))
  return req
}
