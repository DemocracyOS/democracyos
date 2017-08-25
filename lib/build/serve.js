var spawn = require('child_process').spawn
var settings = require('./settings')

// Clone the process.env object and extend it
var env = Object.create(process.env)

var debug = 'democracyos*'
if (undefined !== env.DEBUG) {
  debug = env.DEBUG
} else if (settings.verbose) {
  debug = '*'
}

env.NODE_PATH = '.'
env.DEBUG = debug

module.exports = function () {
  return spawn('node', ['index.js'], { stdio: [0, 1, 2], env: env })
}
