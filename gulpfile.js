var exec = require('child_process').exec;
var gulp = require('gulp');

// javascript
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var mkdirp = require('mkdirp');

gulp
  .task('serve', function (cb) {
    exec('NODE_PATH=. DEBUG=democracyos* node index.js', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    });
  })
  .task('public', function () {
    mkdirp('./public');
  })
  .task('javascript', ['public'], function () {
    var production = false;
    var b = browserify({ entries: './lib/boot/boot.js', debug: !production });
    b = b
      .transform(babelify)
      .bundle()
      .pipe(source('app.js'))
      .pipe(buffer());

    if (!production) b = b.pipe(sourcemaps.init({ loadMaps: true }))
    if (production) b = b.pipe(uglify());
    if (!production) b = b.pipe(sourcemaps.write('./'))

    b.pipe(gulp.dest('./public/'));
  })
  // .task('watch', function () {
  //   gulp.watch(['lib/**/*.js, lib/**/*.jade'], ['javascript'])
  // })
  .task('build', ['javascript'])
  .task('default', ['serve'])