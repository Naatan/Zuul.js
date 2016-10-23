'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var flatten = require('gulp-flatten');
var autoprefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');

gulp.task('default', function ()
{
    gulp.run('elements', 'sass', 'js');
});

gulp.task('elements', function ()
{
    gulp.run('elements-html', 'elements-js');
});


gulp.task('elements-html', function ()
{
    return gulp.src('./elements/**/*.html')
                .pipe(flatten())
                .pipe(gulp.dest('./build'));
});

gulp.task('elements-js', ['elements-html'], function ()
{
    gulp.src('./elements/**/*.js')
            .pipe(fileinclude({
                prefix: '__gulp_', 
                filters: {
                    json: JSON.stringify
                },
                basepath: require("path").join(__dirname, "build")
            }))
            .pipe(flatten())
            .pipe(gulp.dest('./build'));
});

gulp.task('sass', function ()
{
    return gulp.src('./scss/**/*.scss')
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
                .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', ['sass', 'elements'], () =>
{
    gulp.src('js/zuul.js')
            .pipe(fileinclude({
                prefix: '__gulp_', 
                filters: {
                    json: JSON.stringify
                },
                basepath: require("path").join(__dirname, "build")
            }))
            .pipe(babel({
                presets: ['es2015']
            }).on('error', function(e){
                console.log(e);
            }))
            .pipe(gulp.dest('./dist/js'));
});

gulp.task('watchers', function ()
{
  gulp.watch('./scss/**/*.scss', ['sass']);
  gulp.watch('./js/**/*.js', ['js']);
  gulp.watch('./elements/**/*', ['elements', 'js']);
});
