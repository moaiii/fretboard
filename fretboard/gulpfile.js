var gulp = require('gulp');
var server = require('gulp-express');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('watch', function() {
  gulp.watch('public/sass/**/*.scss', ['styles']);
});

gulp.task('styles', function() {
  return gulp.src('public/sass/base.scss')
  .pipe(sass())
  .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('default', ['styles', 'watch']);
