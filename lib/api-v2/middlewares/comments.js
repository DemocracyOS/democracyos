const api = require('../db-api')

module.exports.findById = function findByTopicId (req, res, next) {
  const id = req.params.id

  api.comments.find({_id: id})
    .findOne()
    .exec()
    .then((comment) => {
      if (!comment) {
        const err = new Error(`Comment ${id} not found.`)
        err.status = 404
        err.code = 'COMMENT_NOT_FOUND'
        return next(err)
      }

      req.comment = comment

      next()
    })
    .catch(next)
}
