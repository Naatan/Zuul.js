'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var flatten = require('gulp-flatten');
var autoprefixer = require('gulp-autoprefixer');
var webserver = require('gulp-webserver');
var electron = require('electron-connect').server.create();

gulp.task('default', function ()
{
    gulp.run('html', 'elements', 'sass', 'js');
});

gulp.task('html', function ()
{
    return gulp.src('./src/*.html')
                .pipe(gulp.dest('./dist'));
});

gulp.task('elements', function ()
{
    return gulp.src('./src/elements/*.html')
                .pipe(flatten())
                .pipe(gulp.dest('./dist/elements'));
});

gulp.task('sass', function ()
{
    return gulp.src('./src/scss/**/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', ['sass', 'elements'], () =>
{
    gulp.src('./src/js/zuul.js')
            .pipe(gulp.dest('./dist/js'));
});

gulp.task('watchers', ['default'], function ()
{
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/elements/*.html', ['elements', 'js']);
  gulp.watch('./src/*.html', ['html']);
});

gulp.task('webserver', ['watchers'], function() {
  gulp.src('.')
    .pipe(webserver({
        livereload: true
    }));
});

gulp.task('electron', ['watchers'], function() {
    electron.start();

    gulp.watch('./dist/css/*.css', electron.reload);
    gulp.watch('./dist/**/*.html', electron.reload);
    gulp.watch('./dist/js/*.js', electron.reload);

    gulp.watch('./electron.js', electron.restart);
});

