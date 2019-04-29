
// Required essential packages
var gulp = require('gulp'),
sass = require('gulp-sass'),
js_minify = require('gulp-uglify'),
css_minify = require('gulp-clean-css'),
include_files = require('gulp-file-include'),
concat = require('gulp-concat'),
autoprefixer = require('gulp-autoprefixer'),
compress_image = require('compress-images');


// This project input and output path
const _INPUT_ = 'input/', _OUTPUT_ = 'output/';


/*
    - Compress, optimize and transfer media files
      Only support jpg, JPG, jpeg, JPEG, png, PNG file types
*/
gulp.task('compress_images', function () {
    // Transfer not supported file types
    gulp.src(_INPUT_ + 'images/*.{gif,GIF,svg,SVG}').pipe(gulp.dest(_OUTPUT_ + 'assets/images/'));

    // Optimize supported types
    return new Promise((resolve, reject) => {
        compress_image(
            _INPUT_ + 'images/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
            _OUTPUT_ + 'assets/images/',
            {compress_force: false, statistic: true, autoupdate: true},
            false,
            {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
            {png: {engine: 'pngquant', command: ['--quality=20-50']}},
            {svg: {engine: false, command: false}},
            {gif: {engine: false, command: false}},
            function () {
                return false;
            }
        );
        resolve();
    });
});


// Handle included HTML files
gulp.task('includes', function(){
    return gulp.src(_INPUT_ + 'html/*.html')
    .pipe(include_files({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest(_OUTPUT_));
});


// Handle CSS files
gulp.task('css', function(){
    return gulp.src(_INPUT_ + 'css/style.scss')
    .pipe(autoprefixer())
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(css_minify())
    .pipe(gulp.dest(_OUTPUT_ + 'assets/css/'));
});


// Handle JS files
gulp.task('javascripts', function(){
    return gulp.src([
        _INPUT_ + 'js/jquery.js',
        _INPUT_ + 'js/main.js'
        // Add additional JS files at here ...
    ])
    .pipe(concat('scripts.js'))
    .pipe(js_minify())
    .pipe(gulp.dest(_OUTPUT_ + 'assets/js/'));
});


// Build project
gulp.task('build', gulp.series('javascripts', 'css', 'includes', 'compress_images'));


// Watch tasks
gulp.task('watching', function () {
    gulp.watch([_INPUT_ + 'css/style.scss'], gulp.series('css'));
    gulp.watch([_INPUT_ + 'js/*.js'], gulp.series('javascripts'));
    gulp.watch([_INPUT_ + 'html/*/*.html'], gulp.series('includes'));
});
