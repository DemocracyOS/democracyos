import debug from 'debug';
import o from 'component-dom';
import request from '../request/request.js';
import serialize from 'get-form-data';

let log = debug('democracyos:autosubmit');

export default function(form, fn, postserialize) {
  var form = o(form);
  var action = form.attr('action');
  var method = form.attr('method').toLowerCase();
  var data = serialize(form[0]);
  if (postserialize) postserialize(data);

  if ('delete' == method) {
    method = 'del';
  }

  var req = request[method](action).send(data);
  req.end((err, res) => fn(err, res));
  return req;
}
