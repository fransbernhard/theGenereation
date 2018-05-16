const gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  browserSync = require('browser-sync'),
  merge = require('merge-stream'),
  cssmin = require('gulp-cssmin'),
  uglify = require('gulp-uglifyjs'),
  reload = browserSync.reaload
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  babel = require('gulp-babel'),
  autoprefixer = require('gulp-autoprefixer')

const paths = {
  style: {
    source: 'app/sass/',
    destination: 'dist/css/'
  },
  script: {
    source: 'app/js/**/*.js',
    destination: 'dist/js/'
  }
}

gulp.task('BROWSER-SYNC', function() {
  var files = [
    './style.css',
    './*.html'
  ]

  browserSync.init(files, {
    proxy: "http://localhost/theGeneration/",
    notify: false
  })
})

gulp.task('IMAGES', function(){
  gulp.src('app/img/**/*')
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
    .pipe(gulp.dest(paths.script.destination))
    .pipe(browserSync.reload({
      stream: true
    }));
});

try {
  gulp.task('SASS', function() {
    return gulp.src(paths.style.source + 'style.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write())
      .pipe(cssmin().on('error', function(err) {
        console.log(err);
      }))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(gulp.dest(paths.style.destination))
      .pipe(browserSync.reload({
        stream: true
      }))
  })
} catch(e) {
  console.log("ERROR: ", e.stack)
}

gulp.task('default', ['SASS', 'JS', 'IMAGES', 'BROWSER-SYNC'], function(){
  gulp.watch(paths.style.source + '**/*.scss', ['SASS']);
  gulp.watch(paths.script.source, ['JS']);
  gulp.watch('**/*.html', browserSync.reload);
});
