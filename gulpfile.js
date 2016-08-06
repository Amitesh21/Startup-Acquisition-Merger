// include gulp
var gulp = require('gulp');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');

// include plug-ins
var jshint = require('gulp-jshint');

// JS hint task
gulp.task('jshint', function () {
    gulp.src('./public/javascripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(livereload());
});

// minify new images
gulp.task('imagemin', function () {
    var imgSrc = './public/images/**/*',
        imgDst = './build/images';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(livereload());
});

// include plug-ins
var minifyHTML = require('gulp-minify-html');

// minify new or changed HTML pages
gulp.task('htmlpage', function () {
    var htmlSrc = './views/*.ejs',
        htmlDst = './build';

    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(minifyHTML())
        .pipe(gulp.dest(htmlDst))
        .pipe(livereload());
});

// include plug-ins
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

// JS concat, strip debugging and minify
gulp.task('scripts', function () {
    gulp.src(['./public/javascripts/*.js', 'app.js', './routes/*.js'])
        .pipe(concat('script.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts/'))
        .pipe(livereload());
});

// include plug-ins
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// CSS concat, auto-prefix and minify
gulp.task('styles', function () {
    gulp.src(['./public/stylesheets/*.css'])
        .pipe(concat('style.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./build/styles/'))
        .pipe(livereload());
});


var livereload = require('gulp-livereload');
// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles'], function () {
    // watch for HTML changes
    gulp.watch('./views/*.ejs', function () {
        livereload.listen();
        gulp.run('htmlpage');
    });

    // watch for JS changes
    gulp.watch(['./public/javascripts/*.js', 'app.js', './routes/*.js'], function () {
        livereload.listen();
        gulp.run('jshint', 'scripts');
    });

    // watch for CSS changes
    gulp.watch('./public/stylesheets/*.css', function () {
        livereload.listen();
        gulp.run('styles');
    });
});


