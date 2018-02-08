const { spawn } = require('child_process')
const settings = require('./settings')

// Clone the process.env object and extend it
const env = Object.assign({}, process.env)

if (settings.verbose && !env.DEBUG) {
  env.DEBUG = 'democracyos*'
}

env.NODE_PATH = '.'

module.exports = function () {
  return spawn('node', ['index.js'], { stdio: [0, 1, 2], env: env })
}
