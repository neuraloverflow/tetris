const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const pump = require('pump');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const del = require('del');


gulp.task('clean',function(){
	return del(['build/']);
});

gulp.task('styles',function(){
	return gulp.src('styles.css')
		.pipe(autoprefixer())
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'styles',
            suffix: '.min'
        }))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({stream: true}))
});

// Browser Sync Static server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('js', function(j) {
	pump([
    	gulp.src('*.js'),
        babel({presets: ['es2015']}),
	    uglify(),
        gulp.dest('build')
        ],j);
});

// Concatenates all the scripts in one
gulp.task('useref', function(){
  return gulp.src('*.html')
    .pipe(useref())
    .pipe(gulp.dest('build'));
});


gulp.task('watch',['browserSync','styles','js','useref'],function(){
	gulp.watch('styles.css',['styles']); //in the array you have the tasks you want to run when the file is saved
	gulp.watch('*.html',browserSync.reload);
	gulp.watch('*.js',browserSync.reload);
});