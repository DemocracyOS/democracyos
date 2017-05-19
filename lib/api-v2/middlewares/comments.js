const api = require('../db-api')

module.exports.findById = function findById (req, res, next) {
  const id = req.params.id

  api.comments.find({ _id: id })
    .findOne()
    .exec()
    .then((comment) => {
      if (!comment) return next(new Error404(id))

      req.comment = comment

      next()
    })
    .catch(next)
}

class Error404 extends Error {
  constructor (id) {
    super(`Comment ${id} not found.`)

    this.status = 404
    this.code = 'COMMENT_NOT_FOUND'
  }
}
