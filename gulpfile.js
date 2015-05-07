var gulp = require('gulp');

require('./lib/build/js');
require('./lib/build/css');
require('./lib/build/public');
require('./lib/build/serve');
require('./lib/build/watch');
require('./lib/build/assets');

gulp
  .task('build', ['javascript', 'css'])
  .task('default', ['build', 'serve'])