var gulp = require('gulp');
var settings = require('./settings');
var util = require('gulp-util');
var spawn = require('child_process').spawn;

// Clone the process.env object and extend it
var env = Object.create(process.env);
env.NODE_PATH = '.';
env.DEBUG = 'democracyos*';

module.exports = function (cb) {
  console.log('==============================================================================')
  return spawn('node', ['index.js'], { stdio: [0, 1, 2], env: env });
}
