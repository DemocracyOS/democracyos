var exec = require('child_process').exec;
var gulp = require('gulp');

// javascript
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var jshint = require('gulp-jshint');
var mkdirp = require('mkdirp');

// stylus
var stylint = require('gulp-stylint');

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
  .task('javascript', ['js:build', 'js:lint'])
  .task('js:lint', function () {
    gulp.src('./lib/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  })
  .task('js:build', ['public'], function () {
    var production = false;
    var b = browserify({ entries: './lib/boot/boot.js', debug: !production, verbose: true });
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
  .task('css:build', function () {
    var production = false;
    var t = gulp.src('./lib/**/*.styl')
    if (!production) t = t.pipe(sourcemaps.init());
    t = t.pipe(stylus())
    if (!production) t = t.pipe(sourcemaps.write());
    t = t.pipe(addsrc('./node_modules/**/*.css'))
      .pipe(concat('app.css'));

    if (production) t = t.pipe(minify());
    t.pipe(gulp.dest('./public/'));

  })
  .task('css:lint', function () {
    gulp.src('./lib/**/*.styl')
      .pipe(stylint());
  })
  .task('css', ['css:build', 'css:lint'])
  .task('build', ['javascript', 'css'])
  .task('default', ['serve'])