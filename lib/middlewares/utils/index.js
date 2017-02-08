/**
* Serial execution of middlewares for Connect/Express.js
*
* Example:
* import { a, b, c } from '../my-middlewares'
* import { serial } from '../middlewares/utils'
*
* app.use('/', serial(a, b, c), (req, res) => { res.send('done!') })
*/

module.exports.serial = function serial () {
  var middlewares = Array.prototype.slice.call(arguments)

  return function serialExec (req, res, next) {
    ;(function iterate (m) {
      if (!m.length) return next()
      m[0](req, res, function serialIterateExec (err) {
        if (err) return next(err)
        iterate(m.slice(1))
      })
    })(middlewares)
  }
}

/**
* Parallel execution of middlewares for Connect/Express.js
*
* Example:
* import { a, b, c } from '../my-middlewares'
* import { parallel } from '../middlewares/utils'
*
* app.use('/', parallel(a, b, c), (req, res) => { res.send('done!') })
*/

module.exports.parallel = function parallel () {
  var middlewares = Array.prototype.slice.call(arguments)
  var total = middlewares.length

  return function parallelExec () {
    var args = Array.prototype.slice.call(arguments)
    var next = args[args.length - 1]

    args[args.length - 1] = cb

    middlewares.forEach((m) => m.apply(this, args))

    var i = 0
    function cb (err) {
      if (err) return next(err)
      if (++i === total) next()
    }
  }
}
