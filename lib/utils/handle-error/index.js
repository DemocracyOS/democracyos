import debug from 'debug'

const log = debug('democracyos:error')

export default function handleError(err, req, res) {
  log("Error found: %s", err);
  var error = err;
  if (err.errors && err.errors.text) error = err.errors.text;
  if (error.type) error = error.type;

  res.status(400).send({ error: error });
}