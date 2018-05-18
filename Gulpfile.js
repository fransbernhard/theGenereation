const gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  merge = require('merge-stream'),
  cssmin = require('gulp-cssmin'),
  uglify = require('gulp-uglifyjs'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  autoprefixer = require('gulp-autoprefixer'),
  nodemon = require('gulp-nodemon')

const paths = {
  style: {
    source: 'public/sass/',
    output: 'dist/css/'
  },
  script: {
    source: 'public/js/**/*.js',
    output: 'dist/js/'
  }
}

gulp.task('BROWSER-SYNC', ['NODEMON'], function() {
  var files = [
    './style.css',
    './*.html'
  ]

  browserSync.init(files, {
    proxy: "http://localhost:3000",
    port: 5000,
    notify: true
  })
})

gulp.task('NODEMON', function (cb) {
	var started = false
	return nodemon({
		script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
	}).on('start', function () {
		if (!started) {
			started = true
      cb()
		}
	})
})

gulp.task('IMAGES', function(){
  gulp.src('public/img/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img/'))
})

gulp.task('JS', function() {
  gulp.src(paths.script.source)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify('bundle.min.js'))
    .pipe(gulp.dest(paths.script.output))
    .pipe(reload({
      stream: true
    }))
})

try {
  gulp.task('SASS', function() {
    return gulp.src(paths.style.source + 'style.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write())
      .pipe(cssmin().on('error', function(err) {
        console.log(err)
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(paths.style.output))
      .pipe(reload({
        stream: true
      }))
  })
} catch(e) {
  console.log("ERROR: ", e.stack)
}

gulp.task('default', ['SASS', 'JS', 'IMAGES', 'BROWSER-SYNC'], function(){
  gulp.watch(paths.style.source + '**/*.scss', ['SASS'])
  gulp.watch(paths.script.source, ['JS'])
  gulp.watch('**/*.html', reload)
})
