var typeOf = require('component-type')

module.exports = cast

function cast (to, string) {
  if (to === 'array') {
    if (typeOf(string) !== 'string') {
      throw new Error('Should be a string of values separated by commas.')
    }
    if (string === '') return []
    return string.split(',')
  }

  if (to === 'boolean') {
    if (string === 'true') return true
    if (string === 'false') return false
    throw new Error('Should be a boolean written as string.')
  }

  if (to === 'number') {
    var number = parseInt(string, 10)
    if (typeOf(number) === 'number') return number
    throw new Error('Should be a number written as string.')
  }

  if (to === 'string') {
    if (typeOf(string) === 'string') return string
    throw new Error('Should be string.')
  }

  throw new Error('Invalid cast type.')
}
