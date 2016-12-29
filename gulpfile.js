'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var autoprefixer = require('gulp-autoprefixer');
var webserver = require('gulp-webserver');

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
            .pipe(babel({
                presets: ['es2015']
            }).on('error', function(e){
                console.log(e);
            }))
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
  gulp.src('dist')
    .pipe(webserver({
        livereload: true
    }));
});
