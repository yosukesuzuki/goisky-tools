gulp       = require 'gulp'
browserify = require 'gulp-browserify'
rename     = require 'gulp-rename'
watch      = require 'gulp-watch'
plumber    = require 'gulp-plumber'

gulp.task 'coffee', ->
  gulp
    .src 'src/index.coffee', read: false
    .pipe plumber()
    .pipe browserify
      transform: ['coffeeify']
      extensions: ['.coffee']
      debug: true
    .pipe rename 'app.js'
    .pipe gulp.dest './media/js'

gulp.task 'watch', ->
  gulp.watch('src/**/*.coffee', ['coffee'])

gulp.task 'default', ['coffee']
