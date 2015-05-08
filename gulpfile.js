var gulp = require('gulp');

var settings = {
  public: './public/',
  clientEntryPoint: './lib/boot/boot.js'
};

require('./lib/build/js')(settings);
require('./lib/build/css');
require('./lib/build/public');
require('./lib/build/serve');
require('./lib/build/watch');
require('./lib/build/assets')(settings);
require('./lib/build/clean')(settings);

gulp
  .task('build', ['js:lint', 'js:build', 'css:lint', 'css:build', 'assets'])
  .task('dist', ['js:lint', 'js:dist', 'css:lint', 'css:dist', 'assets'])
  .task('default', ['build', 'serve'])
