/**
* Serial execution of middlewares for Page.js
*
* Example:
* import { a, b, c } from '../my-middlewares'
* import { serial } from '../middlewares/utils/utils'
*
* page('/', serial(a, b, c), (ctx) => { console.log('done!') })
*/

export function serial (...middlewares) {
  return function serialExec (ctx, next) {
    ;(function iterate (m) {
      if (!m.length) return next()
      m[0](ctx, function (err) {
        if (err) return next(err)
        iterate(m.slice(1))
      })
    })(middlewares)
  }
}

/**
* Parallel execution of middlewares for Page.js
*
* Example:
* import { a, b, c } from '../my-middlewares'
* import { parallel } from '../middlewares/utils/utils'
*
* page('/', parallel(a, b, c), (ctx) => { console.log('done!') })
*/

export function parallel (...middlewares) {
  const total = middlewares.length

  return function parallelExec (ctx, next) {
    let i = 0
    middlewares.forEach((m) => m(ctx, cb))
    function cb (err) {
      if (err) return next(err)
      if (++i === total) next()
    }
  }
}
